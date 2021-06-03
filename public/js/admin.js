var admin_bc = document.getElementById("admin_bc");
var user_t = document.getElementById("user_t");
var order_t = document.getElementById("order_t");
var product_t = document.getElementById("product_t");
var u_modal = document.getElementById("u_modal");
var o_modal = document.getElementById("o_modal");
var p_modal = document.getElementById("p_modal");
var d_modal = document.getElementById("d_modal");
var c_modal = document.getElementById("c_modal");
var userTable = document.getElementById("userTable");
var orderTable = document.getElementById("orderTable");
var productTable = document.getElementById("productTable");
var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var image = document.getElementById("image");
var phoneNumber = document.getElementById("phoneNumber");
var email = document.getElementById("email");
var dateOfBirth = document.getElementById("dateOfBirth");
var address = document.getElementById("address");
var orderId = document.getElementById("orderId");
var buyerName = document.getElementById("buyerName");
var orderName = document.getElementById("orderName");
var orderAddress = document.getElementById("orderAddress");
var orderQuantity = document.getElementById("orderQuantity");
var orderPrice = document.getElementById("orderPrice");
var productName = document.getElementById("productName");
var productImg = document.getElementById("productImg");
var productSummary = document.getElementById("productSummary");
var productDescription = document.getElementById("productDescription");
var productAmount = document.getElementById("productAmount");
var productOrigin = document.getElementById("productOrigin");
var productCategory = document.getElementById("productCategory");
var productPrice = document.getElementById("productPrice");
var n_productName = document.getElementById("n_productName");
var n_productImg = document.getElementById("n_productImg");
var n_productSummary = document.getElementById("n_productSummary");
var n_productDescription = document.getElementById("n_productDescription");
var n_productAmount = document.getElementById("n_productAmount");
var n_productOrigin = document.getElementById("n_productOrigin");
var n_productCategory = document.getElementById("n_productCategory");
var n_productPrice = document.getElementById("n_productPrice");
var user_tbody = document.getElementById("user_tbody");
var order_tbody = document.getElementById("order_tbody");
var product_tbody = document.getElementById("product_tbody");
var delete_user = document.getElementById("delete_user");
var edit_product = document.getElementById("edit_product");
var save_product_btn = document.getElementById("save_product_btn");
var delete_product = document.getElementById("delete_product");

var check = 1;
var userCount = 0;
var orderCount = 0;
var productCount = 0;
var lastProductId = 0;

const token = document.cookie.split(';').filter(el => el.trim().startsWith('token='))[0]
    .split('=')[1];

if(token){
    const auth = document.getElementById("auth")
    const logout = document.createElement("a");
    logout.href = '/login';
    logout.innerHTML="Logout";
    logout.onclick= ()=> {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } ;
    auth.removeChild(auth.lastChild);
    auth.appendChild(logout);
}
function user_table(){
    check = 1;
    admin_bc.innerHTML = "Users";
    user_t.classList.remove("hidden");
    order_t.classList.add("hidden");
    product_t.classList.add("hidden");
}

async function order_table(){
    check = 2;
    if(orderCount == 0){
        let allOrder = await fetch("/backend/orders", {
            method: "GET"
        }).then(res => res.json());
        while(allOrder[orderCount]){
            order_tbody.innerHTML += `
                <tr>
                    <td>${orderCount + 1}</td>
                    <td>${allOrder[orderCount].id}</td>
                     <td>${allOrder[orderCount].user.firstName} ${allOrder[orderCount].user.lastName} </td>
                     <td>${allOrder[orderCount].user.address}</td>
                    <td>${allOrder[orderCount].totalPrice}</td>
                    <td class="info-modal" onclick="open_order_modal(this)" name="order_modal">Chi tiết</td>
                </tr>`;
            orderCount++;
        }
    }

    admin_bc.innerHTML = "Orders";
    user_t.classList.add("hidden");
    order_t.classList.remove("hidden");
    product_t.classList.add("hidden");
}

async function product_table(){
    check = 3;
    if(productCount == 0){
        let allProduct = await fetch("/backend/products", {
            method: "GET"
        }).then(res => res.json());
        while(allProduct[productCount]){
            product_tbody.innerHTML += `
                <tr>
                    <td class="hidden">${allProduct[productCount].id}</td>
                    <td>${productCount + 1}</td>
                    <td>${allProduct[productCount].name}</td>
                    <td>${allProduct[productCount].amount}</td>
                    <td class="info-modal" onclick="open_product_modal(this)" name="product_modal">Chi tiết</td>
                </tr>`;
            lastProductId = allProduct[productCount].id;
            productCount++;
        }
    }

    admin_bc.innerHTML = "Products";
    user_t.classList.add("hidden");
    order_t.classList.add("hidden");
    product_t.classList.remove("hidden");
}

function create_modal(){
    save_product_btn.setAttribute("onclick", "create_product()");

    n_productName.removeAttribute("value");
    n_productImg.removeAttribute("src");
    n_productSummary.removeAttribute("value");
    n_productDescription.removeAttribute("value");
    n_productAmount.removeAttribute("value");
    n_productOrigin.removeAttribute("value");
    n_productCategory.removeAttribute("value");
    n_productPrice.removeAttribute("value");

    u_modal.style.display = "none";
    o_modal.style.display = "none";
    p_modal.style.display = "none";
    c_modal.style.display = "block";
}

async function edit_modal(){
    save_product_btn.setAttribute("onclick", "save_product()");

    let id = edit_product.value;
    let url = "/backend/product/".concat(id);
    let product = await fetch(url, {
        method: "GET"
    }).then(res => res.json());
    n_productName.setAttribute("value", product.name);
    n_productImg.setAttribute("src", product.imageURL);
    n_productSummary.setAttribute("value", product.summaryDescription);
    n_productDescription.setAttribute("value", product.description);
    n_productAmount.setAttribute("value", product.amount);
    n_productOrigin.setAttribute("value", product.origin);
    n_productCategory.setAttribute("value", product.category.title);
    n_productPrice.setAttribute("value", product.price);

    u_modal.style.display = "none";
    o_modal.style.display = "none";
    p_modal.style.display = "none";
    c_modal.style.display = "block";
}

function delete_modal(){
    u_modal.style.display = "none";
    o_modal.style.display = "none";
    p_modal.style.display = "none";
    d_modal.style.display = "block";
}

function delete_no(){
    u_modal.style.display = "none";
    o_modal.style.display = "none";
    p_modal.style.display = "none";
    d_modal.style.display = "none";
    c_modal.style.display = "none";
}

async function open_user_modal(element){
    let user_modal = document.getElementsByName("user_modal");
    for(let index in user_modal){
        if(user_modal[index] == element){
            index++;

            //Xử lý sự kiện
            let id = userTable.rows[index].cells[0].innerHTML;
            let url = "/backend/admin/user/".concat(id);
            let user = await fetch(url, {
                method: "GET"
            }).then(res => res.json());
            firstName.setAttribute("value", user.firstName);
            lastName.setAttribute("value", user.lastName);
            image.setAttribute("src", user.imageURL);//xóa dòng attributes:... trong getUser Controller
            phoneNumber.setAttribute("value", user.phoneNumber);
            email.setAttribute("value", user.email);
            dateOfBirth.setAttribute("value", user.dateOfBirth);//dateOfBirth là DATEONLY
            address.setAttribute("value", user.address);
            delete_user.setAttribute("value", id);

            //---------------------------
            index--;
        }
    }
    u_modal.style.display = "block";
}
var checkVarious = 0;
async function open_order_modal(element){
    let order_modal = document.getElementsByName("order_modal");
    for(let index in order_modal){
        if(order_modal[index] == element){
            index++;

            //Xử lý sự kiện

            let id = orderTable.rows[index].cells[1].innerHTML;
            let totalPrice =  orderTable.rows[index].cells[4].innerHTML;
            let url = "backend/order/".concat(id);
            let order = await fetch(url, {
                method: "GET"
            }).then(res => res.json());
            let fullName = order.user.firstName + " " + order.user.lastName;
            orderId.setAttribute("value", id);
            buyerName.setAttribute("value", fullName);
            orderAddress.setAttribute("value", order.user.address); /*User.hasMany(OrderItem);
                                                                    OrderItem.belongsTo(User);*/
            /*include: [User, {
                 model: Product,
                 include: Order
             }]*/
            console.log(order);
            if(checkVarious == 0){
                for(let index2 in order.orderItem){
                    document.getElementById("variousOrder").innerHTML += `
                        <tr>
                            <th>Tên sản phẩm #${parseInt(index2) + 1}</th>
                            <td>
                                <input type="text" class="form-control r-only" value="${order.orderItem[index2].product.name}" disabled>
                            </td>
                        </tr>
                        <tr>
                            <th>Số lượng sản phẩm #${parseInt(index2) + 1}</th>
                            <td>
                                <input type="text" class="form-control r-only" value="${order.orderItem[index2].quantity}" disabled>
                            </td>
                        </tr>`;
                }
                document.getElementById("variousOrder").innerHTML += `
                    <tr>
                        <th>Thành tiền</th>
                        <td>
                            <input type="text" class="form-control r-only" value="${totalPrice}" disabled>
                        </td>
                    </tr>`;
                checkVarious = 1;
            }

            //---------------------------
            index--;
        }
    }
    o_modal.style.display = "block";
}
async function open_product_modal(element){
    let product_modal = document.getElementsByName("product_modal");
    for(let index in product_modal){
        if(product_modal[index] == element){
            index++;

            //Xử lý sự kiện
            let id = productTable.rows[index].cells[0].innerHTML;
            let url = "/backend/product/".concat(id);
            let product = await fetch(url, {
                method: "GET"
            }).then(res => res.json());
            productName.setAttribute("value", product.name);
            productImg.setAttribute("src", product.imageURL);
            productSummary.setAttribute("value", product.summaryDescription);
            productDescription.setAttribute("value", product.description);
            productAmount.setAttribute("value", product.amount);
            productOrigin.setAttribute("value", product.origin);
            productCategory.setAttribute("value", product.category.title);
            productPrice.setAttribute("value", product.price);
            edit_product.setAttribute("value", id);
            delete_product.setAttribute("value", id);

            //---------------------------
            index--;
        }
    }
    p_modal.style.display = "block";
}

function create_product(){
    lastProductId++;
    productCount++;
    product_tbody.innerHTML += `
        <tr>
            <td class="hidden">${lastProductId}</td>
            <td>${productCount}</td>
            <td>${n_productName.value}</td>
            <td>${n_productAmount.value}</td>
            <td class="info-modal" onclick="open_product_modal(this)" name="product_modal">Chi tiết</td>
        </tr>`;
    c_modal.style.display = "none";
    const productFormData = new FormData;
    productFormData.append("name",n_productName.value);
    productFormData.append("price",n_productPrice.value);
    productFormData.append("description",n_productDescription.value);
    productFormData.append("summaryDescription",n_productSummary.value);
    productFormData.append("category",n_productCategory.value);
    productFormData.append("image",n_productImg.files[0]);
    productFormData.append("amount",n_productAmount.value);
    productFormData.append("origin",n_productOrigin.value);
    fetch("/backend/admin/addProduct", {
        method: "POST",
        body: productFormData,
    });
}

function save_product(){
    let id = edit_product.value;
    for(let index = 0; index <= productCount; ++index){
        if(productTable.rows[index].cells[0].innerHTML == id){
            productTable.rows[index].cells[2].innerHTML = n_productName.value;
            productTable.rows[index].cells[3].innerHTML = n_productAmount.value;
            break;
        }
    }
    c_modal.style.display = "none";
    let url = "/backend/admin/editProduct/".concat(id.toString());
    const productEditData = new FormData;
    productEditData.append("name",n_productName.value);
    productEditData.append("price",n_productPrice.value);
    productEditData.append("description",n_productDescription.value);
    productEditData.append("summaryDescription",n_productSummary.value);
    productEditData.append("category",n_productCategory.value);
    productEditData.append("image",n_productImg.files[0]);
    productEditData.append("amount",n_productAmount.value);
    productEditData.append("origin",n_productOrigin.value);
    alert(n_productImg.files[0]);
    fetch(url, {
        method: "PUT",
        body: productEditData
    });
}

async function delete_yes(){
    if(check == 1){
        let id = delete_user.value;
        for(let index = 0; index <= userCount; ++index){
            if(userTable.rows[index].cells[0].innerHTML == id){
                userTable.deleteRow(index);
                userCount--;
                for(let index2 = index; index2 <= userCount; ++index2){
                    userTable.rows[index2].cells[1].innerHTML = index2;
                }
                break;
            }
        }
        d_modal.style.display = "none";
        let url = "/backend/admin/deleteUser/".concat(id.toString()); //sửa req.query.userId thành req.params.userId trong userController
        await fetch(url, {                                            //xóa truncate: true
            method: "DELETE"
        });
    }
    else if(check == 2){

    }
    else if(check == 3){
        let id = delete_product.value;
        for(let index = 0; index <= productCount; ++index){
            if(productTable.rows[index].cells[0].innerHTML == id){
                productTable.deleteRow(index);
                productCount--;
                for(let index2 = index; index2 <= productCount; ++index2){
                    productTable.rows[index2].cells[1].innerHTML = index2;
                }
                break;
            }
        }
        d_modal.style.display = "none";
        let url = "/backend/admin/deleteProduct/".concat(id.toString());
        await fetch(url, {                                       
            method: "DELETE"
        });
    }
}

window.addEventListener("click", function(e){
    if((e.target == u_modal) || (e.target == o_modal) || (e.target == p_modal) || (e.target == d_modal) || (e.target == c_modal)){
        u_modal.style.display = "none";
        o_modal.style.display = "none";
        p_modal.style.display = "none";
        d_modal.style.display = "none";
        c_modal.style.display = "none";
    }
});

window.onload = async function(){
    let allUser = await fetch("/backend/admin/users", {
        method: "GET"
    }).then(res => res.json());
    while(allUser[userCount]){
        user_tbody.innerHTML += `
            <tr>
                <td class="hidden">${allUser[userCount].id}</td>
                <td>${userCount + 1}</td>
                <td>${allUser[userCount].firstName}</td>
                <td>${allUser[userCount].lastName}</td>
                <td class="info-modal" onclick="open_user_modal(this)" name="user_modal">Chi tiết</td>
            </tr>`;
        userCount++;
    }
}