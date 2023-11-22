import{_ as I,k as A,h as L,r as h,m as V,o as E,p as $,a as n,b as f,c as b,d as a,e as s,q as o,j as d,t as r,n as B,A as Y,l as v,v as z,x as F}from"./index-d5318078.js";import{u as R}from"./dataAppointment-4931375c.js";import{d as j}from"./day-a01efc22.js";const i=p=>(z("data-v-c7c5177e"),p=p(),F(),p),U={class:"grid"},q={class:"col-12"},O={class:"card"},K={class:"my-2"},G={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},H=i(()=>a("h5",{class:"m-0"},"Citas Médicas",-1)),J={class:"block mt-2 md:mt-0 p-input-icon-left"},Q=i(()=>a("i",{class:"pi pi-search"},null,-1)),W=i(()=>a("span",{class:"p-column-title"},"Nº Turno",-1)),X=i(()=>a("span",{class:"p-column-title"},"Paciente",-1)),Z=i(()=>a("span",{class:"p-column-title"},"Estado",-1)),ee=i(()=>a("span",{class:"p-column-title"},"Médico",-1)),te=i(()=>a("span",{class:"p-column-title"},"Especialidad",-1)),ae=i(()=>a("span",{class:"p-column-title"},"Fecha Consulta",-1)),se={class:"flex align-items-center justify-content-center"},oe=i(()=>a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),le={key:0},ie={class:"flex align-items-center justify-content-center"},ne=i(()=>a("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),de={key:0},re={__name:"Tracking",setup(p){const y=A(),T=L(),w=R(),_=h([]),k=h(null),m=h({});V(()=>{S()});const D=()=>{k.value.exportCSV()},C=()=>{y.push("/listdoctor")};E(async()=>{await w.getAppointmentUserId(T.user.user.userId).then(e=>_.value=e),_.value.forEach(e=>{console.log(e),e.nameDoctor=`${e.doctor.user.surnames} ${e.doctor.user.name}`,e.dependent?e.patient=`${e.dependent.name} ${e.dependent.surnames}`:e.patient=`${e.user.name} ${e.user.surnames}`})});const S=()=>{m.value={global:{value:null,matchMode:$.CONTAINS}}};return(e,l)=>{const x=n("Toast"),c=n("Button"),M=n("Toolbar"),N=n("InputText"),u=n("Column"),P=n("DataTable"),g=n("Dialog");return f(),b("div",U,[a("div",q,[a("div",O,[s(x),s(M,{class:"mb-4"},{start:o(()=>[a("div",K,[s(c,{label:"Agendar Cita Médica",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:C})])]),end:o(()=>[s(c,{label:"Exportar",icon:"pi pi-upload",class:"p-button-help",onClick:l[0]||(l[0]=t=>D(t))})]),_:1}),s(P,{ref_key:"dt",ref:k,value:_.value,dataKey:"appointmentId",paginator:!0,rows:10,filters:m.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando del  {first} al {last} de {totalRecords} Atenciones",responsiveLayout:"scroll"},{header:o(()=>[a("div",G,[H,a("span",J,[Q,s(N,{modelValue:m.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=t=>m.value.global.value=t),placeholder:"Buscar..."},null,8,["modelValue"])])])]),default:o(()=>[s(u,{field:"timeSlot.nTurn",header:"Nº Turno",sortable:!0,headerStyle:"width:10%; min-width:2rem;"},{body:o(t=>[W,d(" "+r(t.data.timeSlot.nTurn),1)]),_:1}),s(u,{field:"patient",header:"Paciente",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:o(t=>[X,d(" "+r(t.data.patient),1)]),_:1}),s(u,{field:"status",header:"Estado",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:o(t=>[Z,a("span",{class:B("user-badge status-"+(t.data.status?t.data.status.toLowerCase():""))},r(t.data.status),3)]),_:1}),s(u,{field:"nameDoctor",header:"Médico",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:o(t=>[ee,d(" "+r(t.data.nameDoctor),1)]),_:1}),s(u,{field:"doctor.specialization",header:"Especialidad",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:o(t=>[te,d(" "+r(t.data.doctor.specialization),1)]),_:1}),s(u,{field:"timeSlot.orderlyTurn",header:"Fecha Consulta",sortable:!0,headerStyle:"width:15%; min-width:10rem;"},{body:o(t=>[ae,d(" "+r(Y(j)(t.data.timeSlot.orderlyTurn,"DD MMMM YYYY hh:mm a")),1)]),_:1})]),_:1},8,["value","filters"]),s(g,{visible:e.deleteDataTicketDialog,"onUpdate:visible":l[3]||(l[3]=t=>e.deleteDataTicketDialog=t),style:{width:"450px"},header:"Confirm",modal:!0},{footer:o(()=>[s(c,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:l[2]||(l[2]=t=>e.deleteDataTicketDialog=!1)}),s(c,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:e.deleteDataTicket},null,8,["onClick"])]),default:o(()=>[a("div",se,[oe,e.dataTicket?(f(),b("span",le,[d("Estás seguro de que quieres eliminar ticket Nº "),a("b",null,r(e.dataTicket.ticketId),1),d("?")])):v("",!0)])]),_:1},8,["visible"]),s(g,{visible:e.deleteDataTicketsDialog,"onUpdate:visible":l[5]||(l[5]=t=>e.deleteDataTicketsDialog=t),style:{width:"450px"},header:"Confirm",modal:!0},{footer:o(()=>[s(c,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:l[4]||(l[4]=t=>e.deleteDataTicketsDialog=!1)}),s(c,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:e.deleteSelectedDataTickets},null,8,["onClick"])]),default:o(()=>[a("div",ie,[ne,e.dataTicket?(f(),b("span",de,"Are you sure you want to delete the selected Tickets?")):v("",!0)])]),_:1},8,["visible"])])])])}}},me=I(re,[["__scopeId","data-v-c7c5177e"]]);export{me as default};
