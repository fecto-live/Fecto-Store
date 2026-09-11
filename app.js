// Set this after you deploy the free Google Apps Script backend.
// Example: const ORDER_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
const ORDER_ENDPOINT = "";

let cart = JSON.parse(localStorage.getItem("fecto_cart") || "[]");

const $ = s => document.querySelector(s);
const money = n => "₹" + Number(n).toLocaleString("en-IN");

function saveCart(){ localStorage.setItem("fecto_cart", JSON.stringify(cart)); renderCart(); }
function renderProducts(filter="all"){
  const list = filter==="all" ? PRODUCTS : PRODUCTS.filter(p => p.filter==="all" || p.filter===filter);
  $("#products").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <div class="tee ${p.colors[0]}"></div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>Oversized fit · Unisex · Premium cotton</p>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="addToCart('${p.id}')">ADD TO CART</button>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const p=PRODUCTS.find(x=>x.id===id);
  const existing=cart.find(x=>x.id===id && x.size==="M");
  if(existing) existing.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,size:"M",qty:1,color:p.colors[0]});
  saveCart(); openCart();
}
function changeQty(i,d){ cart[i].qty=Math.max(1,cart[i].qty+d); saveCart(); }
function removeItem(i){ cart.splice(i,1); saveCart(); }
function renderCart(){
  $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  $("#cartItems").innerHTML=cart.length ? cart.map((x,i)=>`
    <div class="cart-line">
      <div class="mini-img"><div class="mini-tee ${x.color}"></div></div>
      <div><h4>${x.name}</h4><p>${money(x.price)} · Size ${x.size}</p>
        <div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${i},1)">+</button></div>
      </div>
      <button class="remove" onclick="removeItem(${i})">Remove</button>
    </div>`).join("") : "<p style='color:#777;font-size:13px;padding:25px 0'>Your cart is empty.</p>";
  $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function openCart(){ $("#cartDrawer").classList.add("open"); $("#backdrop").classList.add("open"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#backdrop").classList.remove("open"); }
function checkout(){
  if(!cart.length){alert("Your cart is empty.");return}
  closeCart();
  $("#checkoutSummary").innerHTML=cart.map(x=>`${x.name} × ${x.qty} — ${money(x.price*x.qty)}`).join("<br>")+`<hr><b>Total: ${money(cart.reduce((s,x)=>s+x.price*x.qty,0))}</b>`;
  $("#checkoutModal").classList.add("show");
}
function closeCheckout(){ $("#checkoutModal").classList.remove("show"); }

$("#openCart").onclick=openCart; $("#closeCart").onclick=closeCart; $("#backdrop").onclick=closeCart;
$("#checkoutBtn").onclick=checkout; $("#closeCheckout").onclick=closeCheckout;
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)});

$("#checkoutForm").onsubmit=async e=>{
  e.preventDefault();
  if(!cart.length)return;
  const fd=new FormData(e.target);
  const order={
    orderId:"FEC-"+Date.now().toString().slice(-8),
    createdAt:new Date().toISOString(),
    customer:Object.fromEntries(fd.entries()),
    items:cart.map(x=>({name:x.name,qty:x.qty,size:x.size,color:x.color,price:x.price})),
    total:cart.reduce((s,x)=>s+x.price*x.qty,0)
  };
  $("#formNote").textContent="Placing your order…";
  try{
    if(ORDER_ENDPOINT){
      await fetch(ORDER_ENDPOINT,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(order)});
    }else{
      // Demo mode: saves order in this browser. Connect the free backend before going live.
      const orders=JSON.parse(localStorage.getItem("fecto_orders")||"[]"); orders.push(order); localStorage.setItem("fecto_orders",JSON.stringify(orders));
    }
    cart=[]; saveCart(); e.target.reset(); closeCheckout();
    $("#successText").textContent=`Your order ${order.orderId} has been placed. We’ll use the details you provided to process delivery.`;
    $("#successModal").classList.add("show");
  }catch(err){
    $("#formNote").textContent="Something went wrong. Please try again.";
  }
};
$("#doneBtn").onclick=()=>$("#successModal").classList.remove("show");

renderProducts(); renderCart();