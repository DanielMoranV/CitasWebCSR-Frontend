import{h as U,r as d,u as F,m as E,o as R,p as G,a as u,b as j,c as O,d as l,e as a,q as s,t as v,j as c}from"./index-a19affa2.js";import{u as q}from"./dataAppointment-4893227b.js";import{d as C}from"./day-a01efc22.js";const z={class:"grid"},K={class:"col-12"},$={class:"card"},J={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},Q={class:"m-0"},W={class:"block mt-2 md:mt-0 p-input-icon-left"},X=l("i",{class:"pi pi-search"},null,-1),Z=l("span",{class:"p-column-title"},"Fecha",-1),ee=l("span",{class:"p-column-title"},"Motivo",-1),te=l("span",{class:"p-column-title"},"Diágnostico",-1),oe=l("span",{class:"p-column-title"},"Tratamiento",-1),ae=l("span",{class:"p-column-title"},"Médico",-1),le={class:"field"},se=l("label",{for:"name"},"Motivo de la consulta",-1),ne={class:"field"},ie=l("label",{for:"name"},"Diagnostico",-1),de={class:"field"},re=l("label",{for:"surnames"},"Tratamiendo",-1),_e={__name:"PatientCare",setup(ue){const _=q(),w=U(),n=d(null),I=F(),V=d(null),p=d(null),t=d(null),f=d(null),x=d(null),b=d(null),h=d(null),M=d(!0),D=d(!0),k=()=>x.value.exportCSV(),A=()=>{t.value={reason:"",diagnosis:"",treatment:""},b.value=!1,h.value=!0},S=r=>{t.value=r,console.log(t.value),b.value=!1,h.value=!0},T=()=>{h.value=!1,b.value=!1},H=async()=>{let r={reason:t.value.reason,diagnosis:t.value.diagnosis,treatment:t.value.treatment,userId:n.value.userId,doctorId:n.value.Schedule.doctorId,appointmentId:n.value.appointmentId};t.value.appointmentHistoryId?p.value.findIndex(i=>i.appointmentHistoryId===t.value.appointmentHistoryId)!==-1&&(console.log("payload",r),await _.updateAppointmentHistory(t.value.appointmentHistoryId,r),I.add({severity:"success",summary:"Éxito",detail:"Detalle de Atención Actualizado",life:3e3})):(t.value=await _.createAppointmentHistory(r),t.value.doctor=D.value,t.value.date=C(new Date,"DD MMMM YYYY"),p.value.push(t.value),I.add({severity:"success",summary:"Éxito",detail:"Detalle de Atención Guardado",life:3e3})),b.value=!0,T()};E(()=>P()),R(async()=>{console.log(_.appointment),D.value=await w.user.user.name+" "+w.user.user.surnames,n.value=await _.appointment,n.value.userId=await n.value.Appointment[0].user.userId,await _.getAppointmentHistoryUserId(n.value.userId).then(o=>{p.value=o.map(i=>(i.date=C(i.appointment.timeSlot.orderlyTurn,"DD MMMM YYYY"),i.doctor=i.doctor.user.name+" "+i.doctor.user.surnames,console.log(i.appointmentId),i))}),console.log(n.value.appointmentId),console.log(p.value);const r=p.value.some(o=>o.appointmentId===n.value.appointmentId);M.value=r,console.log(r)});const P=()=>{f.value={global:{value:null,matchMode:G.CONTAINS}}};return(r,o)=>{const i=u("Toast"),g=u("Button"),N=u("Toolbar"),Y=u("InputText"),m=u("Column"),B=u("DataTable"),y=u("Textarea"),L=u("Dialog");return j(),O("div",z,[l("div",K,[l("div",$,[a(i),a(N,{class:"mb-4"},{start:s(()=>[a(g,{disabled:M.value,label:"Nuevo",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:A},null,8,["disabled"])]),end:s(()=>[a(g,{label:"Exportar",icon:"pi pi-upload",class:"p-button-help",onClick:o[0]||(o[0]=e=>k(e))})]),_:1}),a(B,{ref_key:"dt",ref:x,value:p.value,dataKey:"appointmentHistoryId",paginator:!0,rows:10,rowHover:!0,filters:f.value,"onUpdate:filters":o[2]||(o[2]=e=>f.value=e),filterDisplay:"menu",loading:V.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando del  {first} al {last} de {totalRecords} Atenciones",globalFilterFields:["appointmentHistoryId","diagnosis","tratament","reason"],responsiveLayout:"scroll",showGridlines:""},{header:s(()=>[l("div",J,[l("h5",Q,v(n.value?n.value.patient:"--"),1),l("span",W,[X,a(Y,{modelValue:f.value.global.value,"onUpdate:modelValue":o[1]||(o[1]=e=>f.value.global.value=e),placeholder:"Buscar..."},null,8,["modelValue"])])])]),empty:s(()=>[c("No se encontraron citas médicas ")]),loading:s(()=>[c(" Cargando datos. Espere por favor. ")]),default:s(()=>[a(m,{field:"appointmentHistoryId",header:"Nº",sortable:!0,headerStyle:"width:10%; min-width:2rem;"},{body:s(e=>[Z,c(" "+v(e.data.date),1)]),_:1}),a(m,{field:"reason",header:"Motivo",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[ee,c(" "+v(e.data.reason),1)]),_:1}),a(m,{field:"diagnosis",header:"Diágnostico",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[te,c(" "+v(e.data.diagnosis),1)]),_:1}),a(m,{field:"treatment",header:"Tratamiento",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[oe,c(" "+v(e.data.treatment),1)]),_:1}),a(m,{field:"doctor",header:"Médico",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[ae,c(" "+v(e.data.doctor),1)]),_:1}),a(m,{headerStyle:"width:10%; min-width:5rem;",header:"Acciones"},{body:s(e=>[a(g,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mt-2",onClick:ce=>S(e.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","filters","loading"]),a(L,{visible:h.value,"onUpdate:visible":o[6]||(o[6]=e=>h.value=e),style:{width:"500px"},header:"Detalle de Consulta",modal:!0,class:"p-fluid"},{footer:s(()=>[a(g,{label:"Cancelar",icon:"pi pi-times",class:"p-button-text",onClick:T}),a(g,{label:"Guardar",icon:"pi pi-check",class:"p-button-text",onClick:H})]),default:s(()=>[l("div",le,[se,a(y,{cols:"5",id:"name",modelValue:t.value.reason,"onUpdate:modelValue":o[3]||(o[3]=e=>t.value.reason=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])]),l("div",ne,[ie,a(y,{cols:"5",id:"name",modelValue:t.value.diagnosis,"onUpdate:modelValue":o[4]||(o[4]=e=>t.value.diagnosis=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])]),l("div",de,[re,a(y,{cols:"5",id:"surnames",modelValue:t.value.treatment,"onUpdate:modelValue":o[5]||(o[5]=e=>t.value.treatment=e),modelModifiers:{trim:!0},autofocus:""},null,8,["modelValue"])])]),_:1},8,["visible"])])])])}}};export{_e as default};
