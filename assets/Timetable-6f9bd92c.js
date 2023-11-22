import{_ as ie,u as ne,y as ue,r as u,m as de,o as re,p as ce,a as c,b as _,c as f,d as s,e as t,q as n,t as w,j as k,n as U,l as g,w as me,v as ve,x as pe}from"./index-d5318078.js";import{u as _e}from"./dataUser-308a5b9c.js";import{d as F}from"./day-a01efc22.js";import{r as fe,u as he}from"./xlsx-04f2268f.js";const r=V=>(ve("data-v-eb8949e3"),V=V(),pe(),V),be={class:"grid"},ye={class:"col-12"},ge={class:"card"},Te={class:"my-2"},De={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},we={class:"m-0"},ke={class:"block mt-2 md:mt-0 p-input-icon-left"},Se=r(()=>s("i",{class:"pi pi-search"},null,-1)),xe=r(()=>s("span",{class:"p-column-title"},"Día",-1)),Ce=r(()=>s("span",{class:"p-column-title"},"Inicio",-1)),Ie=r(()=>s("span",{class:"p-column-title"},"Fin",-1)),Ue=r(()=>s("span",{class:"p-column-title"},"Capacidad",-1)),Ve={class:"field"},Me=r(()=>s("label",{for:"dni"},"Días",-1)),qe={key:0,class:"p-invalid"},Fe={class:"formgrid grid"},Ne={class:"field col"},He=r(()=>s("label",{for:"startTime"},"Hora Inicio",-1)),Pe={key:0,class:"p-invalid"},Be={class:"field col"},Ye=r(()=>s("label",{for:"endTime"},"Hora Fin",-1)),Le={key:0,class:"p-invalid"},Ae={class:"field"},je=r(()=>s("label",{for:"interval"},"Duracion por consulta (minutos)",-1)),Re={key:0,class:"p-invalid"},$e={class:"formgrid grid"},ze={class:"field col"},Ee=r(()=>s("label",{for:"capacity"},"Capacidad",-1)),Oe={key:0,class:"p-invalid"},Ge={class:"field col"},Ke=r(()=>s("p",null,"Disponible",-1)),Je={class:"flex align-items-center justify-content-center"},Qe=r(()=>s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),We={key:0},Xe={class:"flex align-items-center justify-content-center"},Ze=r(()=>s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),ea={key:0},aa={__name:"Timetable",setup(V){const N=ne(),A=_e(),H=ue(),j=u(null),S=u(null),R=u(null),a=u(null),v=u(null),M=u(null),h=u({}),T=u(!1),x=u(!1),C=u(!1),b=u(null),P=u(null),q=u({}),d=u(!1);de(()=>{te()});const z=`listcolaborator-${F(new Date,"DD-MM-YYYY")}`;re(async()=>{S.value=await H.doctor,j.value=S.value.user.name+" "+S.value.user.surnames,await H.getDoctorSchedule(S.value.user.Doctor.doctorId).then(o=>{R.value=o.map(e=>{let m=F(e.startTime,"hh:mm A"),i=F(e.endTime,"hh:mm A"),y=F(e.day,"DD MMMM YYYY");return e.startTime=m,e.endTime=i,e.day=y,e})})});const E=()=>{a.value={day:null,startTime:null,endTime:null,interval:null,capacity:null,availableSchedule:!0,doctorId:S.value.user.Doctor.doctorId},v.value=null,d.value=!1,T.value=!0,me([()=>a.value.startTime,()=>a.value.endTime,()=>a.value.interval],([o,e,m])=>{if(o!==null&&e!==null&&m!==null){const i=new Date(o),y=new Date(e),D=m,I=(y-i)/(1e3*60);a.value.capacity=Math.floor(I/D)}else a.value.capacity=null})},O=()=>{T.value=!1,d.value=!1},G=()=>a.value.startTime&&a.value.endTime&&a.value.interval&&a.value.capacity&&a.value.availableSchedule&&a.value.doctorId&&v.value,K=async()=>{if(console.log(a.value),console.log(v.value),a.value.scheduleId)console.log("voy a editar");else for(const o of v.value){const e={...a.value,startTime:new Date(o.setHours(a.value.startTime.getHours(),a.value.startTime.getMinutes())),endTime:new Date(o.setHours(a.value.endTime.getHours(),a.value.endTime.getMinutes())),day:o};await H.addDoctorSchedule(e),console.log("Guardando horario:",e),N.add({severity:"success",summary:"Éxito",detail:"Dias y turnos de citas generados correctamente",life:3e3})}T.value=!1,a.value={}},J=async()=>{d.value=!0,G()&&K()},Q=o=>{a.value={...o},v.value=a.value.day,T.value=!0},W=o=>{h.value=o,x.value=!0},X=async()=>{M.value=M.value.filter(o=>o.accessId!==h.value.accessId),await A.disableUser(h.value.accessId),x.value=!1,h.value={},N.add({severity:"success",summary:"Successful",detail:"User Deleted",life:3e3})},Z=()=>{console.log(P.value),P.value.exportCSV()},ee=o=>{const e=o.files[0],m=new FileReader;m.onload=i=>{const y=new Uint8Array(i.target.result),D=fe(y,{type:"array"}),I=D.SheetNames[0],p=D.Sheets[I],B=he.sheet_to_json(p);console.log(B)},m.readAsArrayBuffer(e)},ae=()=>{C.value=!0},le=()=>{M.value=M.value.filter(e=>!b.value.includes(e)),b.value.map(e=>e.accessId).forEach(async e=>{await A.disableUser(e)}),C.value=!1,b.value=null,N.add({severity:"success",summary:"Successful",detail:"Colaboradores deshabilitados",life:3e3})},te=()=>{q.value={global:{value:null,matchMode:ce.CONTAINS}}};return(o,e)=>{const m=c("Toast"),i=c("Button"),y=c("FileUpload"),D=c("Toolbar"),I=c("InputText"),p=c("Column"),B=c("DataTable"),Y=c("Calendar"),$=c("InputNumber"),se=c("InputSwitch"),L=c("Dialog");return _(),f("div",be,[s("div",ye,[s("div",ge,[t(m),t(D,{class:"mb-4"},{start:n(()=>[s("div",Te,[t(i,{label:"Nuevo",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:E}),t(i,{label:"Deshabilitar",icon:"pi pi-trash",class:"p-button-danger",onClick:ae,disabled:!b.value||!b.value.length},null,8,["disabled"])])]),end:n(()=>[t(y,{mode:"basic",accept:".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",auto:!0,maxFileSize:1e6,label:"Importar",chooseLabel:"Importar",class:"mr-2 inline-block",onUpload:ee}),t(i,{label:"Export",icon:"pi pi-upload",class:"p-button-help",onClick:e[0]||(e[0]=l=>Z(l))})]),_:1}),t(B,{ref_key:"dt",ref:P,value:R.value,selection:b.value,"onUpdate:selection":e[2]||(e[2]=l=>b.value=l),dataKey:"schedulesId",paginator:!0,rows:10,filters:q.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando {first} a {last} de {totalRecords} Horarios",responsiveLayout:"scroll",exportFilename:z},{header:n(()=>[s("div",De,[s("h5",we,"Gestión de Horarios Dr "+w(j.value),1),s("span",ke,[Se,t(I,{modelValue:q.value.global.value,"onUpdate:modelValue":e[1]||(e[1]=l=>q.value.global.value=l),placeholder:"Buscar..."},null,8,["modelValue"])])])]),default:n(()=>[t(p,{selectionMode:"multiple",headerStyle:"width: 3rem"}),t(p,{field:"day",header:"Día",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[xe,k(" "+w(l.data.day),1)]),_:1}),t(p,{field:"startTime",header:"Inicio",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Ce,k(" "+w(l.data.startTime),1)]),_:1}),t(p,{field:"endTime",header:"Fin",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Ie,k(" "+w(l.data.endTime),1)]),_:1}),t(p,{field:"capacity",header:"Capacidad",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:n(l=>[Ue,k(" "+w(l.data.capacity),1)]),_:1}),t(p,{headerStyle:"min-width:10rem;",header:"Acciones"},{body:n(l=>[t(i,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:oe=>Q(l.data)},null,8,["onClick"]),t(i,{icon:"pi pi-trash",class:"p-button-rounded p-button-warning mt-2",onClick:oe=>W(l.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","selection","filters"]),t(L,{visible:T.value,"onUpdate:visible":e[9]||(e[9]=l=>T.value=l),style:{width:"500px"},header:"Horario de consultas",modal:!0,class:"p-fluid"},{footer:n(()=>[t(i,{label:"Cancelar",icon:"pi pi-times",class:"p-button-text",onClick:O}),t(i,{label:"Guardar",icon:"pi pi-check",class:"p-button-text",onClick:J})]),default:n(()=>[s("div",Ve,[Me,t(Y,{showIcon:!0,showButtonBar:!0,modelValue:v.value,"onUpdate:modelValue":e[3]||(e[3]=l=>v.value=l),dateFormat:"dd/mm/yy",required:"true",selectionMode:"multiple",class:U({"p-invalid":d.value&&!a.value.daysSchedule}),minDate:new Date},null,8,["modelValue","class","minDate"]),d.value&&!v.value?(_(),f("small",qe,"Días es requerido.")):g("",!0)]),s("div",Fe,[s("div",Ne,[He,t(Y,{id:"calendar-timeonly",modelValue:a.value.startTime,"onUpdate:modelValue":e[4]||(e[4]=l=>a.value.startTime=l),timeOnly:"",hourFormat:"12",required:"true",showIcon:!0,manualInput:!0,class:U({"p-invalid":d.value&&!a.value.startTime})},null,8,["modelValue","class"]),d.value&&!a.value.startTime?(_(),f("small",Pe,"Hora inicio es requerido.")):g("",!0)]),s("div",Be,[Ye,t(Y,{id:"calendar-timeonly",modelValue:a.value.endTime,"onUpdate:modelValue":e[5]||(e[5]=l=>a.value.endTime=l),timeOnly:"",hourFormat:"12",required:"true",showIcon:!0,manualInput:!0,class:U({"p-invalid":d.value&&!a.value.endTime})},null,8,["modelValue","class"]),d.value&&!a.value.endTime?(_(),f("small",Le,"Hora inicio es requerido.")):g("",!0)])]),s("div",Ae,[je,t($,{id:"interval",modelValue:a.value.interval,"onUpdate:modelValue":e[6]||(e[6]=l=>a.value.interval=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:U({"p-invalid":d.value&&!a.value.interval})},null,8,["modelValue","class"]),d.value&&!a.value.interval?(_(),f("small",Re,"Intervalo es requerido.")):g("",!0)]),s("div",$e,[s("div",ze,[Ee,t($,{id:"capacity",modelValue:a.value.capacity,"onUpdate:modelValue":e[7]||(e[7]=l=>a.value.capacity=l),modelModifiers:{trim:!0},required:"true",autofocus:"",class:U({"p-invalid":d.value&&!a.value.capacity}),disabled:!0},null,8,["modelValue","class"]),d.value&&!a.value.capacity?(_(),f("small",Oe,"Capacidad es requerido.")):g("",!0)]),s("div",Ge,[Ke,t(se,{modelValue:a.value.availableSchedule,"onUpdate:modelValue":e[8]||(e[8]=l=>a.value.availableSchedule=l)},null,8,["modelValue"])])])]),_:1},8,["visible"]),t(L,{visible:x.value,"onUpdate:visible":e[11]||(e[11]=l=>x.value=l),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(i,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:e[10]||(e[10]=l=>x.value=!1)}),t(i,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:X})]),default:n(()=>[s("div",Je,[Qe,h.value?(_(),f("span",We,[k("¿Estás seguro de que quieres eliminar "),s("b",null,w(h.value.user.name),1),k("?")])):g("",!0)])]),_:1},8,["visible"]),t(L,{visible:C.value,"onUpdate:visible":e[13]||(e[13]=l=>C.value=l),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(i,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:e[12]||(e[12]=l=>C.value=!1)}),t(i,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:le})]),default:n(()=>[s("div",Xe,[Ze,h.value?(_(),f("span",ea,"¿Está seguro de que desea eliminar los usuarios seleccionados?")):g("",!0)])]),_:1},8,["visible"])])])])}}},ia=ie(aa,[["__scopeId","data-v-eb8949e3"]]);export{ia as default};