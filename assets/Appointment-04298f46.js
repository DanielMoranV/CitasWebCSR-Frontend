import{k as G,u as J,y as K,h as O,r as s,z as Q,w as X,o as Z,a as p,b as C,c as I,d as o,t as D,e as u,q as ee,A as B,F as te}from"./index-d5318078.js";import{u as ae}from"./dataUser-308a5b9c.js";import{u as oe}from"./dataAppointment-4931375c.js";import{d as r}from"./day-a01efc22.js";const se={class:"flex align-items-center py-5 px-3"},le=o("i",{class:"pi pi-fw pi-check mr-2 text-2xl"},null,-1),ne={class:"m-0 text-lg"},de={class:"card p-fluid"},ie=o("h6",null,"Detalle de consulta",-1),ue={class:"field grid"},re=o("label",{for:"patients",class:"col-12 mb-2 md:col-2 md:mb-0"},"Paciente",-1),ce={class:"col-12 md:col-10"},me={class:"field grid"},pe=o("label",{for:"date",class:"col-12 mb-2 md:col-2 md:mb-0"},"Fecha",-1),ve={class:"col-12 md:col-10"},_e={key:0,style:{padding:"50%",color:"green","font-size":"1.1em","background-color":"lightgreen","border-radius":"50%"},class:"available-date"},he={key:1},fe={class:"field grid"},De=o("label",{for:"hour",class:"col-12 mb-2 md:col-2 md:mb-0"},"Horario",-1),ge={class:"col-12 md:col-10"},ye={class:"field grid"},be=o("label",{for:"hour",class:"col-12 mb-2 md:col-2 md:mb-0"},"Precio Consulta",-1),Se={class:"col-12 md:col-10"},we=29,xe={__name:"Appointment",setup(Ve){const F=G(),Y=J(),x=K(),c=O(),L=oe(),N=ae(),T=s(null),v=s(null),g=s(null),_=s(null),m=s(null),y=s([]),b=s([]),M=s(null),k=s([]),U=s([]),S=s([]),i=s([]),w=s(),E=s(null),h=new Date,V=new Date(h);V.setDate(h.getDate()+we);const P=Q(()=>t=>{const e=t.year,a=(t.month+1).toString().padStart(2,"0"),n=t.day.toString().padStart(2,"0");return`${e}-${a}-${n}`}),z=t=>{const e=r(t,"YYYY-MM-DD"),a=T.value.filter(d=>r(new Date(d.day),"YYYY-MM-DD")===e),n=[];a[0].timeSlot.forEach(d=>{n.push({code:d.timeSlotId,name:r(d.orderlyTurn,"hh:mm A")})}),v.value=n},W=t=>{v.value?t.query.trim().length?y.value=v.value.filter(e=>e.name.toLowerCase().startsWith(t.query.toLowerCase())):y.value=[...v.value]:Y.add({severity:"warn",summary:"Alerta",detail:"Seleccione una fecha de cita Médica",life:3e3})},$=t=>{t.query.trim().length?b.value=g.value.filter(e=>e.name.toLowerCase().startsWith(t.query.toLowerCase())):b.value=[...g.value]};X(w,t=>{E.value=t,z(t)});const A=s(!1),H=async()=>{if(!R()){Y.add({severity:"warn",summary:"Alerta",detail:"Datos incompletos",life:3e3});return}A.value=!0;const t={origin:"web",status:"pendiente",createAt:new Date,doctorId:i.value.doctor_id,userId:c.user.userId,dependentId:null,timeSlotId:_.value.code,appointmentServices:{create:[{medicalServiceId:1}]}};t[m.value.code===c.user.userId?"userId":"dependentId"]=m.value.code,await L.addappointment(t),F.push("/quote/payment"),A.value=!1},R=()=>m.value&&_.value,q=s(!0);return Z(async()=>{i.value=x.doctor[0],await x.getDoctorSchedule(i.value.doctor_id).then(a=>{T.value=a.map(n=>{let d=r(n.startTime,"hh:mm A"),f=r(n.endTime,"hh:mm A");return n.startTime=d,n.endTime=f,k.value.push(new Date(n.day)),n})});const t=[];for(let a=new Date(h);a<=V;a.setDate(a.getDate()+1))t.push(new Date(a));S.value=k.value.map(a=>r(a,"YYYY-MM-DD")),U.value=t.filter(a=>!S.value.includes(r(a,"YYYY-MM-DD"))),M.value=await N.getUsersDependents(c.user.user.dni);const e=[];e.push({code:c.user.user.userId,name:c.user.user.name+" "+c.user.user.surnames}),M.value.forEach(a=>{e.push({code:a.dependentId,name:a.name+" "+a.surnames})}),e&&(g.value=e,m.value=e[0],q.value=!1)}),(t,e)=>{const a=p("Toast"),n=p("AutoComplete"),d=p("Calendar"),f=p("InputText"),j=p("Button");return C(),I(te,null,[o("div",se,[le,o("p",ne,"Médico: "+D(i.value.medico),1)]),o("div",de,[o("h6",null,"Especialidad: "+D(i.value.specialization),1),ie,o("div",ue,[re,o("div",ce,[u(a),u(n,{placeholder:"Nombre del paciente",id:"patients",dropdown:!0,modelValue:m.value,"onUpdate:modelValue":e[0]||(e[0]=l=>m.value=l),suggestions:b.value,onComplete:e[1]||(e[1]=l=>$(l)),field:"name",disabled:q.value},null,8,["modelValue","suggestions","disabled"])])]),o("div",me,[pe,o("div",ve,[u(d,{placeholder:"Días disponibles",showIcon:!0,modelValue:w.value,"onUpdate:modelValue":e[2]||(e[2]=l=>w.value=l),manualInput:!1,minDate:B(h),maxDate:B(V),disabledDates:U.value},{date:ee(l=>[S.value.includes(P.value(l.date))?(C(),I("div",_e,D(l.date.day),1)):(C(),I("div",he,D(l.date.day),1))]),_:1},8,["modelValue","minDate","maxDate","disabledDates"])])]),o("div",fe,[De,o("div",ge,[u(a),u(n,{placeholder:"Hora disponible",id:"timeSlot",dropdown:!0,modelValue:_.value,"onUpdate:modelValue":e[3]||(e[3]=l=>_.value=l),suggestions:y.value,onComplete:e[4]||(e[4]=l=>W(l)),field:"name"},null,8,["modelValue","suggestions"])])]),o("div",ye,[be,o("div",Se,[u(f,{id:"price",type:"text",modelValue:i.value.price,"onUpdate:modelValue":e[5]||(e[5]=l=>i.value.price=l),disabled:!0},null,8,["modelValue"])])]),u(j,{label:"Siguiente",icon:"pi pi-arrow-right",class:"p-button-success col-12 md:col-3 mr-2 mb-2",loading:A.value,onClick:H},null,8,["loading"])])],64)}}};export{xe as default};
