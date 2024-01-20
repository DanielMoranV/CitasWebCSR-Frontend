import{i as U,r as d,u as F,p as E,o as R,q as G,a as r,b as O,c as j,d as s,k as a,s as l,t as m,l as c}from"./index-7e3665c5.js";import{u as q}from"./dataAppointment-36412409.js";import{d as C}from"./day-a01efc22.js";const z={class:"grid"},K={class:"col-12"},$={class:"card"},J={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},Q={class:"m-0"},W={class:"block mt-2 md:mt-0 p-input-icon-left"},X=s("i",{class:"pi pi-search"},null,-1),Z=s("span",{class:"p-column-title"},"Fecha",-1),ee=s("span",{class:"p-column-title"},"Motivo",-1),te=s("span",{class:"p-column-title"},"Diágnostico",-1),ae=s("span",{class:"p-column-title"},"Tratamiento",-1),oe=s("span",{class:"p-column-title"},"Médico",-1),se={class:"field"},le=s("label",{for:"name"},"Motivo de la consulta",-1),ne={class:"field"},ie=s("label",{for:"name"},"Diagnostico",-1),de={class:"field"},re=s("label",{for:"surnames"},"Tratamiendo",-1),_e={__name:"PatientCare",setup(ue){const b=q(),w=U(),n=d(null),I=F(),k=d(null),v=d(null),o=d(null),_=d(null),x=d(null),y=d(null),f=d(null),M=d(!0),D=d(!0),V=()=>x.value.exportCSV(),A=()=>{o.value={reason:"",diagnosis:"",treatment:""},y.value=!1,f.value=!0},S=u=>{o.value=u,y.value=!1,f.value=!0},T=()=>{f.value=!1,y.value=!1},H=async()=>{let u={reason:o.value.reason,diagnosis:o.value.diagnosis,treatment:o.value.treatment,userId:n.value.userId,doctorId:n.value.Schedule.doctorId,appointmentId:n.value.appointmentId};o.value.appointmentHistoryId?v.value.findIndex(i=>i.appointmentHistoryId===o.value.appointmentHistoryId)!==-1&&(await b.updateAppointmentHistory(o.value.appointmentHistoryId,u),I.add({severity:"success",summary:"Éxito",detail:"Detalle de Atención Actualizado",life:3e3})):(o.value=await b.createAppointmentHistory(u),o.value.doctor=D.value,o.value.date=C(new Date,"DD MMMM YYYY"),v.value.push(o.value),I.add({severity:"success",summary:"Éxito",detail:"Detalle de Atención Guardado",life:3e3})),y.value=!0,T()};E(()=>P()),R(async()=>{D.value=await w.user.user.name+" "+w.user.user.surnames,n.value=await b.appointment,n.value.userId=await n.value.Appointment[0].user.userId,await b.getAppointmentHistoryUserId(n.value.userId).then(t=>{v.value=t.map(i=>(i.date=C(i.appointment.timeSlot.orderlyTurn,"DD MMMM YYYY"),i.doctor=i.doctor.user.name+" "+i.doctor.user.surnames,i))});const u=v.value.some(t=>t.appointmentId===n.value.appointmentId);M.value=u});const P=()=>{_.value={global:{value:null,matchMode:G.CONTAINS}}};return(u,t)=>{const i=r("Toast"),h=r("Button"),N=r("Toolbar"),Y=r("InputText"),p=r("Column"),B=r("DataTable"),g=r("Textarea"),L=r("Dialog");return O(),j("div",z,[s("div",K,[s("div",$,[a(i),a(N,{class:"mb-4"},{start:l(()=>[a(h,{disabled:M.value,label:"Nuevo",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:A},null,8,["disabled"])]),end:l(()=>[a(h,{label:"Exportar",icon:"pi pi-upload",class:"p-button-help",onClick:t[0]||(t[0]=e=>V(e))})]),_:1}),a(B,{ref_key:"dt",ref:x,value:v.value,dataKey:"appointmentHistoryId",paginator:!0,rows:10,rowHover:!0,filters:_.value,"onUpdate:filters":t[2]||(t[2]=e=>_.value=e),filterDisplay:"menu",loading:k.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando del  {first} al {last} de {totalRecords} Atenciones",globalFilterFields:["appointmentHistoryId","diagnosis","tratament","reason"],responsiveLayout:"scroll",showGridlines:""},{header:l(()=>[s("div",J,[s("h5",Q,m(n.value?n.value.patient:"--"),1),s("span",W,[X,a(Y,{modelValue:_.value.global.value,"onUpdate:modelValue":t[1]||(t[1]=e=>_.value.global.value=e),placeholder:"Buscar..."},null,8,["modelValue"])])])]),empty:l(()=>[c("No se encontraron citas médicas ")]),loading:l(()=>[c(" Cargando datos. Espere por favor. ")]),default:l(()=>[a(p,{field:"appointmentHistoryId",header:"Nº",sortable:!0,headerStyle:"width:10%; min-width:2rem;"},{body:l(e=>[Z,c(" "+m(e.data.date),1)]),_:1}),a(p,{field:"reason",header:"Motivo",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:l(e=>[ee,c(" "+m(e.data.reason),1)]),_:1}),a(p,{field:"diagnosis",header:"Diágnostico",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:l(e=>[te,c(" "+m(e.data.diagnosis),1)]),_:1}),a(p,{field:"treatment",header:"Tratamiento",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:l(e=>[ae,c(" "+m(e.data.treatment),1)]),_:1}),a(p,{field:"doctor",header:"Médico",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:l(e=>[oe,c(" "+m(e.data.doctor),1)]),_:1}),a(p,{headerStyle:"width:10%; min-width:5rem;",header:"Acciones"},{body:l(e=>[a(h,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mt-2",onClick:ce=>S(e.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","filters","loading"]),a(L,{visible:f.value,"onUpdate:visible":t[6]||(t[6]=e=>f.value=e),style:{width:"500px"},header:"Detalle de Consulta",modal:!0,class:"p-fluid"},{footer:l(()=>[a(h,{label:"Cancelar",icon:"pi pi-times",class:"p-button-text",onClick:T}),a(h,{label:"Guardar",icon:"pi pi-check",class:"p-button-text",onClick:H})]),default:l(()=>[s("div",se,[le,a(g,{cols:"5",id:"name",modelValue:o.value.reason,"onUpdate:modelValue":t[3]||(t[3]=e=>o.value.reason=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])]),s("div",ne,[ie,a(g,{cols:"5",id:"name",modelValue:o.value.diagnosis,"onUpdate:modelValue":t[4]||(t[4]=e=>o.value.diagnosis=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])]),s("div",de,[re,a(g,{cols:"5",id:"surnames",modelValue:o.value.treatment,"onUpdate:modelValue":t[5]||(t[5]=e=>o.value.treatment=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])])]),_:1},8,["visible"])])])])}}};export{_e as default};
