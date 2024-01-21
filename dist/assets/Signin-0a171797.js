import{u as q}from"./dataUser-fe915d66.js";import{p as A,u as $,j as M,r as m,k as Y,w as z,a as r,b as h,d as b,e as t,l as a,t as D,n as U,h as x}from"./index-4af1a839.js";const L={class:"card"},j=t("h5",null,"Datos Personales",-1),Z={class:"p-fluid formgrid grid"},G={class:"field col-12 md:col-6"},H=t("label",null,"Tipo de documento",-1),J={class:"grid mt-2"},K={class:"col-4 md:col-4"},O={class:"field-radiobutton mb-0"},Q=t("label",{for:"dni"},"DNI",-1),R={class:"col-4 md:col-4"},W={class:"field-radiobutton mb-0"},X=t("label",{for:"ce"},"CE",-1),ee={class:"col-4 md:col-4"},oe={class:"field-radiobutton mb-0"},te=t("label",{for:"pasaport"},"Pasaporte",-1),se={class:"field col-12 md:col-6"},le={for:"document"},ae={key:0,class:"p-invalid"},de={class:"field col-12 md:col-6"},ne=t("label",{for:"name"},"Nombre",-1),ie={class:"field col-12 md:col-6"},re=t("label",{for:"surnames"},"Apellidos",-1),ue={class:"field col-12 md:col-6"},ce=t("label",{for:"email"},"Email",-1),me={class:"field col-12 md:col-6"},pe=t("label",{for:"address"},"Dirección",-1),_e={class:"field col-12 md:col-3"},ve=t("label",{for:"birthDate"},"Fecha de Nacimiento",-1),fe={class:"field col-12 md:col-3"},he=t("label",{for:"sex"},"Sexo",-1),be={class:"field col-12 md:col-3"},Ve=t("label",{for:"civilStatus"},"Estado Civil",-1),ye={class:"field col-12 md:col-3"},Te=t("label",{for:"phone"},"Teléfono",-1),ge={key:0,class:"p-invalid"},Se={__name:"Signin",setup(De){const V=A(),S=$(),d=M(),y=q(),u=m(!1),c=m(!0),e=Y({documentType:"DNI",dni:"",name:"",surnames:"",phone:"",email:"",address:"",birthDate:"",sex:"",civilStatus:""});z([()=>d.sessionUser,()=>e.dni],async([l,o])=>{l&&d.user&&await d.currentUser(d.user.username),v(o)&&e.documentType==="DNI"&&B(o)});const C=m([{name:"Masculino",code:"Masculino"},{name:"Femenino",code:"Femenino"}]),w=m([{name:"Soltero",code:"Soltero"},{name:"Casado",code:"Casado"},{name:"Divorciado",code:"Divorciado"},{name:"Viudo",code:"Viudo"}]),p=m(!1),_=(l,o,n)=>{S.add({severity:l,summary:o,life:n})},I=()=>{const l=["documentType","dni","name","surnames","phone","email","address","birthDate","sex","civilStatus"];for(const o of l)if(!e[o])return _("error","Por favor, complete todos los campos obligatorios.",3e3),!1;return!0},N=()=>{const l=new Date,o=new Date(e.birthDate);return l.getFullYear()-o.getFullYear()<18?(_("error","Debes ser mayor de edad para registrarte. Registra a tu padre o apoderado",5e3),!1):!0},f=l=>/^[0-9]{9}$/.test(l),B=async l=>{const o=await d.searchbydni(l);e.name=(o==null?void 0:o.nombres)||"",e.surnames=(o==null?void 0:o.apellidop)+" "+(o==null?void 0:o.apellidom),o||(e.dni="",e.name="",e.surnames="")},v=l=>e.documentType==="DNI"?(c.value=!0,/^\d{8}$/.test(l)):e.documentType==="CE"?(c.value=!1,/^\d{9}$/.test(l)):e.documentType==="Pasaporte"?(c.value=!1,/^[A-Za-z0-9]{5,20}$/.test(l)):!0,P=async()=>{if(u.value=!0,!I()||!N()||!v(e.dni)||!f(e.phone))return;if(p.value=!0,await y.addPatients(e),y.msg==="Violación de la restricción única."){_("error","DNI registrado anteriormente!",5e3),p.value=!1;return}const l={username:e.dni,password:e.dni};await d.login(l),d.sessionUser&&(_("success","Validación Correcta Bienvenido",3e3),setTimeout(()=>V.push("/quotes"),2e3)),setTimeout(()=>p.value=!1,1e3)},F=()=>{setTimeout(()=>V.push("/auth/login"),500)};return(l,o)=>{const n=r("RadioButton"),i=r("InputText"),k=r("Calendar"),T=r("Dropdown"),E=r("Toast"),g=r("Button");return h(),b("div",L,[j,t("div",Z,[t("div",G,[H,t("div",J,[t("div",K,[t("div",O,[a(n,{id:"dni",name:"option",value:"DNI",modelValue:e.documentType,"onUpdate:modelValue":o[0]||(o[0]=s=>e.documentType=s)},null,8,["modelValue"]),Q])]),t("div",R,[t("div",W,[a(n,{id:"ce",name:"option",value:"CE",modelValue:e.documentType,"onUpdate:modelValue":o[1]||(o[1]=s=>e.documentType=s)},null,8,["modelValue"]),X])]),t("div",ee,[t("div",oe,[a(n,{id:"pasaport",name:"option",value:"Pasaporte",modelValue:e.documentType,"onUpdate:modelValue":o[2]||(o[2]=s=>e.documentType=s)},null,8,["modelValue"]),te])])])]),t("div",se,[t("label",le,D(e.documentType),1),a(i,{id:"document",type:"text",modelValue:e.dni,"onUpdate:modelValue":o[3]||(o[3]=s=>e.dni=s),class:U({"p-invalid":u.value&&!e.dni||!v(e.dni)})},null,8,["modelValue","class"]),u.value&&!e.dni||!v(e.dni)?(h(),b("small",ae,D(e.documentType)+" es requerido o formato inválido",1)):x("",!0)]),t("div",de,[ne,a(i,{disabled:c.value,id:"name",type:"text",modelValue:e.name,"onUpdate:modelValue":o[4]||(o[4]=s=>e.name=s)},null,8,["disabled","modelValue"])]),t("div",ie,[re,a(i,{disabled:c.value,id:"surnames",type:"text",modelValue:e.surnames,"onUpdate:modelValue":o[5]||(o[5]=s=>e.surnames=s)},null,8,["disabled","modelValue"])]),t("div",ue,[ce,a(i,{id:"email",type:"text",modelValue:e.email,"onUpdate:modelValue":o[6]||(o[6]=s=>e.email=s)},null,8,["modelValue"])]),t("div",me,[pe,a(i,{id:"address",type:"text",modelValue:e.address,"onUpdate:modelValue":o[7]||(o[7]=s=>e.address=s)},null,8,["modelValue"])]),t("div",_e,[ve,a(k,{showIcon:!0,showButtonBar:!0,modelValue:e.birthDate,"onUpdate:modelValue":o[8]||(o[8]=s=>e.birthDate=s),dateFormat:"dd/mm/yy"},null,8,["modelValue"])]),t("div",fe,[he,a(T,{id:"sex",modelValue:e.sex,"onUpdate:modelValue":o[9]||(o[9]=s=>e.sex=s),options:C.value,optionLabel:"name",placeholder:"Selecciona",optionValue:"code"},null,8,["modelValue","options"])]),t("div",be,[Ve,a(T,{id:"civilStatus",modelValue:e.civilStatus,"onUpdate:modelValue":o[10]||(o[10]=s=>e.civilStatus=s),options:w.value,optionLabel:"name",placeholder:"Selecciona",optionValue:"code"},null,8,["modelValue","options"])]),t("div",ye,[Te,a(i,{id:"phone",modelValue:e.phone,"onUpdate:modelValue":o[11]||(o[11]=s=>e.phone=s),modelModifiers:{trim:!0},class:U({"p-invalid":u.value&&!e.phone||!f(e.phone)})},null,8,["modelValue","class"]),u.value&&!e.phone||!f(e.phone)?(h(),b("small",ge," Teléfono es requerido o formato inválido")):x("",!0)])]),a(E),a(g,{label:"Agendar Cita",icon:"pi pi-calendar",class:"p-button-success col-12 md:col-3 mr-2 mb-2",loading:p.value,onClick:P},null,8,["loading"]),a(g,{label:"Ya estas registrado ?",icon:"pi pi-user",class:"p-button-info col-12 md:col-3 p-button-text mr-2 mb-2",onClick:F})])}}};export{Se as default};