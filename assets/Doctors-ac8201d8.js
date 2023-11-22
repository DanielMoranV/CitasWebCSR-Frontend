import{_ as de,k as ce,u as me,y as pe,r as c,m as ve,o as _e,p as fe,a as d,b as m,c as p,d as o,e as t,q as n,j as I,t as b,n as g,l as f,B as he,v as be,x as ye}from"./index-d5318078.js";import{u as De}from"./dataUser-308a5b9c.js";import{d as $,a as Ie}from"./day-a01efc22.js";import{r as ge,u as Ve}from"./xlsx-04f2268f.js";const i=P=>(be("data-v-9eb8be81"),P=P(),ye(),P),xe={class:"grid"},we={class:"col-12"},ke={class:"card"},Pe={class:"my-2"},ze={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},Ce=i(()=>o("h5",{class:"m-0"},"Gestión de Médicos",-1)),Se={class:"block mt-2 md:mt-0 p-input-icon-left"},Ue=i(()=>o("i",{class:"pi pi-search"},null,-1)),Ne=i(()=>o("span",{class:"p-column-title"},"DNI",-1)),Me=i(()=>o("span",{class:"p-column-title"},"Nombre",-1)),Te=i(()=>o("span",{class:"p-column-title"},"Apellidos",-1)),qe=i(()=>o("span",{class:"p-column-title"},"Rol",-1)),Ee=i(()=>o("span",{class:"p-column-title"},"Rol",-1)),Fe=i(()=>o("span",{class:"p-column-title"},"Status",-1)),Re={class:"field"},Be=i(()=>o("label",{class:"mb-3"},"Tipo de documento",-1)),Ae={class:"formgrid grid"},$e={class:"field-radiobutton col-4"},Le=i(()=>o("label",{for:"dni"},"DNI",-1)),Ye={class:"field-radiobutton col-4"},je=i(()=>o("label",{for:"ce"},"CE",-1)),Ge={class:"field-radiobutton col-4"},Oe=i(()=>o("label",{for:"pasaport"},"Pasaporte",-1)),Ke={class:"field"},Ze={for:"dni"},He={key:0,class:"p-invalid"},Je={class:"field"},Qe=i(()=>o("label",{for:"name"},"Nombre",-1)),We={key:0,class:"p-invalid"},Xe={class:"field"},es=i(()=>o("label",{for:"surnames"},"Apellidos",-1)),ss={key:0,class:"p-invalid"},ls={class:"formgrid grid"},os={class:"field col"},as=i(()=>o("label",{for:"birthDate"},"Fecha de Nacimiento",-1)),ts={key:0,class:"p-invalid"},is={class:"field col"},rs=i(()=>o("label",{for:"phone"},"Teléfono",-1)),ns={key:0,class:"p-invalid"},us={class:"formgrid grid"},ds={class:"field col"},cs=i(()=>o("label",{for:"sex"},"Sexo",-1)),ms={key:0,class:"p-invalid"},ps={class:"field col"},vs=i(()=>o("label",{for:"status"},"Estado",-1)),_s=i(()=>o("br",null,null,-1)),fs={class:"formgrid grid"},hs={class:"field col"},bs=i(()=>o("label",{for:"cpm"},"CMP",-1)),ys={class:"field col"},Ds=i(()=>o("label",{for:"rne"},"RNE",-1)),Is={class:"field"},gs=i(()=>o("label",{for:"specialization"},"Especialidad",-1)),Vs={key:0,class:"p-invalid"},xs={class:"field"},ws=i(()=>o("label",{for:"personalizedPrice"},"Costo de Consulta",-1)),ks={key:0,class:"p-invalid"},Ps={class:"flex align-items-center justify-content-center"},zs=i(()=>o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),Cs={key:0},Ss={class:"flex align-items-center justify-content-center"},Us=i(()=>o("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),Ns={key:0},Ms={__name:"Doctors",setup(P){const L=ce(),V=me(),B=pe(),z=De(),h=c(null),e=c({}),x=c(!1),Y=c(!1),w=c(!1),k=c(!1),D=c(null),U=c(null),C=c({}),r=c(!1),j=c([{name:"Masculino",code:"Masculino"},{name:"Femenino",code:"Femenino"}]),G=a=>{B.doctor=a,he.setItem("doctor",a),L.push("/timetable")},N=c({3:"Médico"}),M=a=>e.value.user.documentType==="DNI"?/^\d{8}$/.test(a):e.value.user.documentType==="CE"?/^\d{9}$/.test(a):e.value.user.documentType==="Pasaporte"?/^[A-Za-z0-9]{5,20}$/.test(a):!0,T=a=>/^[0-9]{9}$/.test(a);ve(()=>{te()});const O=`listcolaborator-${$(new Date,"DD-MM-YYYY")}`;_e(async()=>{await B.getDoctors().then(a=>{h.value=a.map(s=>{let y=$(s.user.birthDate,"DD MMMM YYYY");return s.user.birthDate=y,s.roleName=N.value[s.roleId],s})})});const K=()=>{e.value={accessId:null,active:null,createAt:null,lastSession:null,password:null,roleId:null,roleName:null,status:null,user:{address:null,birthDate:null,civilStatus:null,dni:null,documentType:"DNI",email:null,name:null,phone:null,photo:null,sex:null,surnames:null,userId:null,Doctor:{cpm:null,doctorId:null,rne:null,specialization:null,status:null,userId:null,personalizedPrices:[{personalizedPrice:null,medicalServiceId:1}]}}},r.value=!1,x.value=!0},Z=()=>{x.value=!1,Y.value=!1,r.value=!1},H=()=>{const a=e.value.user;return a.name&&a.name.trim()&&a.surnames&&a.dni&&a.birthDate&&a.sex&&e.value.user.Doctor.status&&M(a.dni),T(a.phone)},J=async()=>{const a={address:e.value.user.address,birthDate:Ie(new Date(e.value.user.birthDate)),civilStatus:e.value.user.civilStatus,dni:e.value.user.dni,documentType:e.value.user.documentType,email:e.value.user.email,name:e.value.user.name,phone:e.value.user.phone,photo:e.value.user.photo,sex:e.value.user.sex,surnames:e.value.user.surnames,access:{username:`${e.value.user.dni}-3`,password:e.value.user.dni,roleId:3},Doctor:{status:e.value.user.Doctor.status,cmp:e.value.user.Doctor.cmp,rne:e.value.user.Doctor.rne,specialization:e.value.user.Doctor.specialization,personalizedPrices:[{personalizedPrice:e.value.user.Doctor.personalizedPrices[0].personalizedPrice,medicalServiceId:1}]}};if(e.value.accessId){const s=h.value.findIndex(y=>y.accessId===e.value.accessId);s!==-1&&(a.access.accessId=e.value.accessId,a.userId=e.value.user.userId,a.Doctor.doctorId=e.value.user.Doctor.doctorId,a.Doctor.personalizedPrices[0].personalizedPriceId=e.value.user.Doctor.personalizedPrices[0].personalizedPriceId,a.Doctor.personalizedPrices[0].doctorId=e.value.user.Doctor.doctorId,console.log("user:",e.value),console.log("payload",a),await z.updateUser(a.dni,a.access.accessId,a.Doctor.doctorId,a.Doctor.personalizedPrices[0].personalizedPriceId,a),e.value.roleName=N.value[e.value.roleId],h.value[s]=e.value,V.add({severity:"success",summary:"Éxito",detail:"Médico Actualizado",life:3e3}))}else{console.log(a);const s=await z.addUsers(a);if(console.log(s),s=="Violación de la restricción única."){V.add({severity:"error",summary:"Error",detail:"DNI o CMP ya registrados, corregir",life:3e3});return}else console.log(s.value),e.value.accessId=s.access[0].accessId,e.value.roleName=N.value[s.access[0].roleId],e.value.status="offline",h.value.push(e.value),V.add({severity:"success",summary:"Éxito",detail:"Médico Registrado",life:3e3})}x.value=!1,e.value={}},Q=async()=>{r.value=!0,H()?J():V.add({severity:"error",summary:"Error",detail:"Datos imcompletos por favor llenar todo el formulario",life:3e3})},W=a=>{console.log(a),e.value={...a},x.value=!0},X=a=>{e.value=a,w.value=!0},ee=async()=>{h.value=h.value.filter(a=>a.accessId!==e.value.accessId),await z.disableUser(e.value.accessId),w.value=!1,e.value={},V.add({severity:"success",summary:"Éxito",detail:"Médico deshabilitado",life:3e3})},se=()=>{console.log(U.value),U.value.exportCSV()},le=a=>{const s=a.files[0],y=new FileReader;y.onload=u=>{const q=new Uint8Array(u.target.result),S=ge(q,{type:"array"}),v=S.SheetNames[0],_=S.Sheets[v],E=Ve.sheet_to_json(_);console.log(E)},y.readAsArrayBuffer(s)},oe=()=>{k.value=!0},ae=()=>{h.value=h.value.filter(s=>!D.value.includes(s)),D.value.map(s=>s.accessId).forEach(async s=>{await z.disableUser(s)}),k.value=!1,D.value=null,V.add({severity:"success",summary:"Éxito",detail:"Médicos deshabilitados",life:3e3})},te=()=>{C.value={global:{value:null,matchMode:fe.CONTAINS}}};return(a,s)=>{const y=d("Toast"),u=d("Button"),q=d("FileUpload"),S=d("Toolbar"),v=d("InputText"),_=d("Column"),E=d("DataTable"),F=d("RadioButton"),ie=d("Calendar"),re=d("Dropdown"),ne=d("InputSwitch"),ue=d("InputNumber"),R=d("Dialog");return m(),p("div",xe,[o("div",we,[o("div",ke,[t(y),t(S,{class:"mb-4"},{start:n(()=>[o("div",Pe,[t(u,{label:"Nuevo",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:K}),t(u,{label:"Deshabilitar",icon:"pi pi-trash",class:"p-button-danger",onClick:oe,disabled:!D.value||!D.value.length},null,8,["disabled"])])]),end:n(()=>[t(q,{mode:"basic",accept:".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",auto:!0,maxFileSize:1e6,label:"Importar",chooseLabel:"Importar",class:"mr-2 inline-block",onUpload:le}),t(u,{label:"Export",icon:"pi pi-upload",class:"p-button-help",onClick:s[0]||(s[0]=l=>se(l))})]),_:1}),t(E,{ref_key:"dt",ref:U,value:h.value,selection:D.value,"onUpdate:selection":s[2]||(s[2]=l=>D.value=l),dataKey:"accessId",paginator:!0,rows:10,filters:C.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando {first} a {last} de {totalRecords} Colaboradores",responsiveLayout:"scroll",exportFilename:O},{header:n(()=>[o("div",ze,[Ce,o("span",Se,[Ue,t(v,{modelValue:C.value.global.value,"onUpdate:modelValue":s[1]||(s[1]=l=>C.value.global.value=l),placeholder:"Buscar..."},null,8,["modelValue"])])])]),default:n(()=>[t(_,{selectionMode:"multiple",headerStyle:"width: 3rem"}),t(_,{field:"user.dni",header:"DNI",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Ne,I(" "+b(l.data.user.dni),1)]),_:1}),t(_,{field:"user.name",header:"Nombre",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Me,I(" "+b(l.data.user.name),1)]),_:1}),t(_,{field:"user.surnames",header:"Apellidos",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Te,I(" "+b(l.data.user.surnames),1)]),_:1}),t(_,{field:"roleName",header:"Rol",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[qe,I(" "+b(l.data.roleName),1)]),_:1}),t(_,{field:"user.doctors.specialization",header:"Especialidad",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Ee,I(" "+b(l.data.user.Doctor.specialization),1)]),_:1}),t(_,{field:"status",header:"Status",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Fe,o("span",{class:g("user-badge status-"+(l.data.status?l.data.status.toLowerCase():""))},b(l.data.status),3)]),_:1}),t(_,{headerStyle:"min-width:10rem;",header:"Acciones"},{body:n(l=>[t(u,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:A=>W(l.data)},null,8,["onClick"]),t(u,{icon:"pi pi-calendar-plus",class:"p-button-rounded p-button-info mr-2",onClick:A=>G(l.data)},null,8,["onClick"]),t(u,{icon:"pi pi-trash",class:"p-button-rounded p-button-warning mt-2",onClick:A=>X(l.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","selection","filters"]),t(R,{visible:x.value,"onUpdate:visible":s[17]||(s[17]=l=>x.value=l),style:{width:"500px"},header:"Detalle de Médico",modal:!0,class:"p-fluid"},{footer:n(()=>[t(u,{label:"Cancelar",icon:"pi pi-times",class:"p-button-text",onClick:Z}),t(u,{label:"Guardar",icon:"pi pi-check",class:"p-button-text",onClick:Q})]),default:n(()=>[o("div",Re,[Be,o("div",Ae,[o("div",$e,[t(F,{id:"dni",name:"option",value:"DNI",modelValue:e.value.user.documentType,"onUpdate:modelValue":s[3]||(s[3]=l=>e.value.user.documentType=l)},null,8,["modelValue"]),Le]),o("div",Ye,[t(F,{id:"ce",name:"option",value:"CE",modelValue:e.value.user.documentType,"onUpdate:modelValue":s[4]||(s[4]=l=>e.value.user.documentType=l)},null,8,["modelValue"]),je]),o("div",Ge,[t(F,{id:"pasaport",name:"option",value:"Pasaporte",modelValue:e.value.user.documentType,"onUpdate:modelValue":s[5]||(s[5]=l=>e.value.user.documentType=l)},null,8,["modelValue"]),Oe])])]),o("div",Ke,[o("label",Ze,b(e.value.documentType),1),t(v,{id:"dni",modelValue:e.value.user.dni,"onUpdate:modelValue":s[6]||(s[6]=l=>e.value.user.dni=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:g({"p-invalid":r.value&&!e.value.user.dni||!M(e.value.user.dni)})},null,8,["modelValue","class"]),r.value&&!e.value.user.dni||!M(e.value.user.dni)?(m(),p("small",He,b(e.value.user.documentType)+" es requerido o formato inválido",1)):f("",!0)]),o("div",Je,[Qe,t(v,{id:"name",modelValue:e.value.user.name,"onUpdate:modelValue":s[7]||(s[7]=l=>e.value.user.name=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:g({"p-invalid":r.value&&!e.value.user.name})},null,8,["modelValue","class"]),r.value&&!e.value.user.name?(m(),p("small",We,"Nombre es requerido.")):f("",!0)]),o("div",Xe,[es,t(v,{id:"surnames",modelValue:e.value.user.surnames,"onUpdate:modelValue":s[8]||(s[8]=l=>e.value.user.surnames=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:g({"p-invalid":r.value&&!e.value.user.surnames})},null,8,["modelValue","class"]),r.value&&!e.value.user.surnames?(m(),p("small",ss,"Apellido es requerido.")):f("",!0)]),o("div",ls,[o("div",os,[as,t(ie,{showIcon:!0,showButtonBar:!0,modelValue:e.value.user.birthDate,"onUpdate:modelValue":s[9]||(s[9]=l=>e.value.user.birthDate=l),dateFormat:"dd/mm/yy",required:"true"},null,8,["modelValue"]),r.value&&!e.value.birthDate?(m(),p("small",ts,"Fecha de nacimiento es requerido.")):f("",!0)]),o("div",is,[rs,t(v,{id:"phone",modelValue:e.value.user.phone,"onUpdate:modelValue":s[10]||(s[10]=l=>e.value.user.phone=l),modelModifiers:{trim:!0},class:g({"p-invalid":r.value&&!e.value.user.phone||!T(e.value.user.phone)})},null,8,["modelValue","class"]),r.value&&!e.value.user.phone||!T(e.value.user.phone)?(m(),p("small",ns," Teléfono es requerido o formato inválido")):f("",!0)])]),o("div",us,[o("div",ds,[cs,t(re,{id:"sex",modelValue:e.value.user.sex,"onUpdate:modelValue":s[11]||(s[11]=l=>e.value.user.sex=l),options:j.value,optionLabel:"name",placeholder:"Selecciona",optionValue:"code"},null,8,["modelValue","options"]),r.value&&!e.value.user.sex?(m(),p("small",ms,"Sexo es requerido.")):f("",!0)]),o("div",ps,[vs,_s,t(ne,{id:"status",modelValue:e.value.user.Doctor.status,"onUpdate:modelValue":s[12]||(s[12]=l=>e.value.user.Doctor.status=l),modelModifiers:{trim:!0}},null,8,["modelValue"])])]),o("div",fs,[o("div",hs,[bs,t(v,{id:"cmp",modelValue:e.value.user.Doctor.cmp,"onUpdate:modelValue":s[13]||(s[13]=l=>e.value.user.Doctor.cmp=l),modelModifiers:{trim:!0}},null,8,["modelValue"])]),o("div",ys,[Ds,t(v,{id:"rne",modelValue:e.value.user.Doctor.rne,"onUpdate:modelValue":s[14]||(s[14]=l=>e.value.user.Doctor.rne=l),modelModifiers:{trim:!0}},null,8,["modelValue"])])]),o("div",Is,[gs,t(v,{id:"specialization",modelValue:e.value.user.Doctor.specialization,"onUpdate:modelValue":s[15]||(s[15]=l=>e.value.user.Doctor.specialization=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:g({"p-invalid":r.value&&!e.value.user.Doctor.specialization})},null,8,["modelValue","class"]),r.value&&!e.value.user.Doctor.specialization?(m(),p("small",Vs,"Especialidad es requerida.")):f("",!0)]),o("div",xs,[ws,t(ue,{modelValue:e.value.user.Doctor.personalizedPrices[0].personalizedPrice,"onUpdate:modelValue":s[16]||(s[16]=l=>e.value.user.Doctor.personalizedPrices[0].personalizedPrice=l),inputId:"personalizedPrice",mode:"currency",currency:"PEN",locale:"es-PE",required:"true",autofocus:"",class:g({"p-invalid":r.value&&!e.value.user.Doctor.personalizedPrices[0].personalizedPrice})},null,8,["modelValue","class"]),r.value&&!e.value.user.Doctor.personalizedPrices[0].personalizedPrice?(m(),p("small",ks,"Especialidad es requerida.")):f("",!0)])]),_:1},8,["visible"]),t(R,{visible:w.value,"onUpdate:visible":s[19]||(s[19]=l=>w.value=l),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(u,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:s[18]||(s[18]=l=>w.value=!1)}),t(u,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:ee})]),default:n(()=>[o("div",Ps,[zs,e.value?(m(),p("span",Cs,[I("¿Estás seguro de que quieres eliminar "),o("b",null,b(e.value.user.name),1),I("?")])):f("",!0)])]),_:1},8,["visible"]),t(R,{visible:k.value,"onUpdate:visible":s[21]||(s[21]=l=>k.value=l),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(u,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:s[20]||(s[20]=l=>k.value=!1)}),t(u,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:ae})]),default:n(()=>[o("div",Ss,[Us,e.value?(m(),p("span",Ns,"¿Está seguro de que desea eliminar los usuarios seleccionados?")):f("",!0)])]),_:1},8,["visible"])])])])}}},Rs=de(Ms,[["__scopeId","data-v-9eb8be81"]]);export{Rs as default};