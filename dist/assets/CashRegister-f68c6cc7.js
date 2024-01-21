import{u as f}from"./dataAdmissionist-137fba89.js";import{u as b,j as v,r as _,o as y,a as h,b as B,d as R,e,l as m,t as a,m as i}from"./index-4af1a839.js";const w={class:"card"},j={class:"flex align-items-center justify-content-between mb-4"},C=e("h5",null,"Caja Registradora",-1),k={class:"block text-600 font-medium mb-3"},S={class:"p-0 mx-0 mt-0 mb-4 list-none"},A={class:"flex align-items-center py-2 border-bottom-1 surface-border"},I=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-dollar text-xl text-green-500"})],-1),$={class:"text-900 line-height-3"},N={class:"text-blue-500"},E={class:"flex align-items-center py-2 border-bottom-1 surface-border"},T=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-yellow-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-chart-line text-xl text-yellow-500"})],-1),F={class:"text-900 line-height-3"},Y={class:"text-blue-500"},P={class:"flex align-items-center py-2 border-bottom-1 surface-border"},V=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-wallet text-xl text-pink-500"})],-1),D={class:"text-900 line-height-3"},H={class:"text-red-500"},O={class:"block text-600 font-medium mb-3"},L={class:"p-0 m-0 list-none"},M={class:"flex align-items-center py-2 border-bottom-1 surface-border"},q=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-green-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-dollar text-xl text-green-500"})],-1),z={class:"text-900 line-height-3"},G={class:"text-blue-500"},J={class:"flex align-items-center py-2 border-bottom-1 surface-border"},K=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-yellow-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-chart-line text-xl text-yellow-500"})],-1),Q={class:"text-900 line-height-3"},U={class:"text-blue-500"},W={class:"flex align-items-center py-2 border-bottom-1 surface-border"},X=e("div",{class:"w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0"},[e("i",{class:"pi pi-wallet text-xl text-pink-500"})],-1),Z={class:"text-900 line-height-3"},ee={class:"text-red-500"},ne={__name:"CashRegister",setup(te){const g=b(),c=f(),o=v(),r=_(!0),s=_(null),t=_(),p=async()=>{const{accessId:l}=o.user,{value:d}=s,u={admissionistId:l,currentBalance:0,openingBalance:d?d.closingBalance:0};t.value=await c.createCashRegister(u),r.value=!0,g.add({severity:"success",summary:"Éxito",detail:"Registro de caja aperturado",life:3e3})},n=l=>(l=l/100,l.toLocaleString("es-PE",{style:"currency",currency:"PEN"}));return y(async()=>{s.value=await c.getPreviousCashRegisterForAdmissionist(o.user.accessId),t.value=await c.getTodayCashRegisterForAdmissionist(o.user.accessId),t.value===null?(r.value=!1,s.value=await c.getCashRegisterForAdmissionist(o.user.accessId)):(r.value=!0,t.value.currentBalance=await c.sumIngressAmountByCashRegisterId(t.value.cashRegisterId))}),(l,d)=>{const u=h("Toast"),x=h("Button");return B(),R("div",w,[e("div",j,[C,e("div",null,[m(u),m(x,{icon:"pi pi-plus",class:"p-button-text p-button-plain p-button-rounded",disabled:r.value,onClick:p},null,8,["disabled"])])]),e("span",k,a(t.value!==null&&t.value!==void 0?`HOY (Registro de caja N°: ${t.value.cashRegisterId})`:"HOY (Registro de caja aún sin generar)"),1),e("ul",S,[e("li",A,[I,e("span",$,[i("Balance de apertura "),e("span",N,a(t.value!==null&&t.value!==void 0?`${n(t.value.openingBalance)}`:"S/. --.--"),1)])]),e("li",E,[T,e("span",F,[i("Balance de actual "),e("span",Y,a(t.value!==null&&t.value!==void 0?`${n(t.value.currentBalance)}`:"S/. --.--"),1)])]),e("li",P,[V,e("span",D,[i("Balance de Cierre (Saldo en Caja) "),e("span",H,a(t.value!==null&&t.value!==void 0?`${n(t.value.closingBalance)}`:"S/. --.--"),1)])])]),e("span",O,a(s.value!==null&&s.value!==void 0?`AYER (Registro de caja N°: ${s.value.cashRegisterId})`:"AYER (Registro de caja aún sin generar)"),1),e("ul",L,[e("li",M,[q,e("span",z,[i("Balance de apertura "),e("span",G,a(s.value!==null&&s.value!==void 0?`${n(s.value.openingBalance)}`:"S/. --.--"),1)])]),e("li",J,[K,e("span",Q,[i("Balance de actual "),e("span",U,a(s.value!==null&&s.value!==void 0?`${n(s.value.currentBalance)}`:"S/. --.--"),1)])]),e("li",W,[X,e("span",Z,[i("Balance de Cierre (Saldo en Caja) "),e("span",ee,a(s.value!==null&&s.value!==void 0?`${n(s.value.closingBalance)}`:"S/. --.--"),1)])])])])}}};export{ne as default};