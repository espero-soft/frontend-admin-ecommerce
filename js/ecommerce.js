class Ecommerce {

    constructor() {
        this.api_key = "API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41";
        this.api = "http://localhost/ecommerce/backend/api/";
        this.actions = ['orders', 'users', 'category', 'products'];
        this.data = [];
        this.initRouter();
        this.initDataApp();
    }

    initRouter() {
        this.actions.forEach((action) => {
            document.getElementById(action).addEventListener('click', () => {
                fetch('templates/' + action + '.html')
                    .then((response) => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            console.log('Erreur de chargement du tempate');
                        }
                    }).then((data) => {
                        document.getElementsByClassName('container-fluid')[0].innerHTML = data;
                        if (action == 'products') {
                            this.loadProducts();
                            document.querySelectorAll(".category").forEach((select, i) => {
                              var option = "";
                              this.getData("category").forEach((item, i) => {
                                option += "<option value='"+item.idCategory+"'>"+item.name+"</option>"
                              });
                              select.innerHTML += option;
                            });

                        } else if (action == 'category') {
                            this.loadCategory();
                        } else if (action == 'users') {
                            this.loadUsers();
                        } else if (action == 'orders') {
                            this.loadOrders();
                        }
                    })
            })
        })
    }

    initDataApp() {
        this.actions.forEach((action) => {
            const url = this.api + action + "?" + this.api_key;
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        console.log("Erreur de chargement des données");
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        this.data.push({ name: action, data: response.result });
                        //console.log("load data");
                        //localStorage.setItem(action, JSON.stringify(response.result));
                    }
                })
        })
    }

    getData(action) {
        var object = this.data.find(element => element.name == action);
        return object.data;
        //return JSON.parse(localStorage.getItem(entity)) ? JSON.parse(localStorage.getItem(entity)) : [];
    }

    getOptions(){
      var options = "";
      this.getData("category").forEach((item, i) => {
        options += "<option value='"+item.idCategory+"'>"+item.name+"</option>"
      });
      return options;
    }



    loadProducts() {
        var categories = this.getData('category');
        var productsTable= $('#dataTable').DataTable({
            data: this.getData('products'),
            columns: [
                { data: 'idProduct' },
                { data: 'name' },
                { data: 'description' },
                { data: 'price',
                render: function ( data, type, row ) {
                    return '€'+ data;
                } },
                { data: 'stock' },
                { data: 'createdAt' },
                { data: 'idProduct',
                render: function ( id, type, row ) {
                      var options = "";

                      categories.forEach((category) => {
                        if(category.idCategory == row.Category){
                          options += "<option value='"+category.idCategory+"' selected>"+category.name+"</option>";
                        }else{
                          options += "<option value='"+category.idCategory+"'>"+category.name+"</option>"
                        }
                      });
                    return `<button type="button" data-toggle="modal" data-target="#updateProduct-${id}" class="btn btn-sm btn-success">UPDATE</button>
                            <button type="button" data-toggle="modal" data-target="#deleteProduct-${id}" class="btn btn-sm btn-danger">DELETE</button>

                    <!-- Modal UPDATE PRODUCT-->
                    <div class="modal fade" id="updateProduct-${id}" tabindex="-1" aria-labelledby="updateProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title" id="exampleModalLabel">Update Product</h2>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form action="" id="formUpdateProduct-${id}">
                                        <div class="form-row">
                                            <div class="col">
                                                <label for="name">Name : </label>
                                                <input  name="name" type="text" value="${ row.name }" class="form-control" required>

                                                <span class="">This field is required</span>

                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col">
                                                <label for="description">Description : </label>
                                                <textarea  name="description" cols="30" rows="10" class="form-control" required>${ row.description }</textarea>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="col">
                                                <label for="price">Price : </label>
                                                <input  name="price" value="${ row.price }" type="number" class="form-control" required>
                                            </div>
                                            <div class="col">
                                                <label for="stock">Stock : </label>
                                                <input  name="stock" value="${ row.stock }" type="number" class="form-control" required>
                                            </div>
                                            <div class="col">
                                                <label for="category">Category : </label>
                                                <select  name="category" class="form-control" required>
                                                  ${ options }
                                                </select>
                                            </div>
                                            <div class="col">
                                                <label for="image" >Image : </label>
                                                <input  name="image" type="file" class="form-control"  accept="image/*">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" onclick="updateProduct(${id}, '${row.image}')" data-dismiss="modal" class="btn btn-primary">Update Product</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal DELETE PRODUCT-->
                    <div class="modal fade" id="deleteProduct-${id}" tabindex="-1" aria-labelledby="deleteProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title" id="deleteModalLabel">Confirmation message</h2>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Are you sure you want to delete this product? We remind you that this action is irreversible!</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" onclick="deleteProduct(${id})" data-dismiss="modal" class="btn btn-danger">Delete Product</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    `;
                }}
            ]
        });
    }
    loadCategory() {
        $('#dataTable').DataTable({
            data: this.getData('category'),
            columns: [
                { data: 'idCategory' },
                { data: 'name' },
            ]
        });
    }
    loadUsers() {
        $('#dataTable').DataTable({
            data: this.getData('users'),
            columns: [
                { data: 'idUser' },
                { data: 'email' },
                { data: 'firstname' },
                { data: 'lastname' }
            ]
        });
    }
    loadOrders() {
        $('#dataTable').DataTable({
            data: this.getData('orders'),
            columns: [
                { data: 'idOrder' },
                { data: 'idUser' },
                { data: 'idProduct' },
                { data: 'quantity' },
                { data: 'price' },
                { data: 'createdAd' }
            ]
        });
    }

}

export { Ecommerce }
