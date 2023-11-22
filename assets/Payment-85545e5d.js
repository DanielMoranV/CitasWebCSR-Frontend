import{r as l,h as f,k as M,u as P,o as T,a as p,b as D,c as x,d as t,e as m,t as u,A as C,F as N}from"./index-d5318078.js";import{u as S}from"./dataAppointment-4931375c.js";import{d as v}from"./day-a01efc22.js";const k=t("div",{class:"flex align-items-center py-5 px-3"},[t("i",{class:"pi pi-fw pi-money-bill mr-2 text-2xl"}),t("p",{class:"m-0 text-lg"},"Pago de consultas médicas")],-1),q={class:"grid justify-content-center"},z={class:"col-12 md:col-6 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0"},A={style:{padding:"2px","border-radius":"10px",background:"linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))"}},Y={class:"p-3 surface-card h-full",style:{"border-radius":"8px"}},w={class:"mt-3 mb-1"},E={class:"mb-1"},V={class:"mb-1"},B={class:"mb-1"},K={__name:"Payment",setup($){const a=l(null),n=S(),s=f(),y=M(),d=P(),e=l(null),h=l(!1),_=l(null),c=l(!0),r=l({amount:null,paymentDate:null,appointmentId:null,paymentMethodId:null,VoucherTypeId:null,userId:null}),b=async()=>{Culqi.settings({title:"CSR Consultas Web",currency:"PEN",amount:r.value.amount*100}),Culqi.open()};return T(async()=>{const o=document.createElement("script");o.src="https://checkout.culqi.com/js/v4",o.async=!0,o.onload=()=>{Culqi.publicKey="pk_test_73e0f77c30643c37",c.value=!1},document.body.appendChild(o),e.value=await n.getAppointmentId(n.appointment.appointmentId);const i=e.value.dependentId?`${e.value.dependent.name} ${e.value.dependent.surnames}`:`${e.value.user.name} ${e.value.user.surnames}`;e.value.patient=i,r.value={amount:e.value.doctor.personalizedPrices[0].personalizedPrice,paymentDate:new Date,appointmentId:n.appointment.appointmentId,paymentMethodId:2,VoucherTypeId:_.value,userId:s.user.user.userId}}),window.addEventListener("culqiTokenCreated",async o=>{a.value=o.detail,a.value.metadata.appointmentId=n.appointment.appointmentId,a.value.metadata.paymentMethodId=2,a.value.metadata.VoucherTypeId=5,a.value.metadata.paymentDate=r.value.paymentDate,a.value.metadata.userId=s.user.user.userId,a.value.metadata.amount=r.value.amount*100,a.value.client.address=s.user.user.address,a.value.client.phone=s.user.user.phone,a.value.client.name=s.user.user.name,a.value.client.surnames=s.user.user.surnames,a.value.dataPayment={nameDoctor:e.value.doctor.user.name+" "+e.value.doctor.user.surnames,specialty:e.value.doctor.specialization,patient:e.value.patient,date:v(e.value.timeSlot.orderlyTurn,"DD MMMM YYYY hh:mm A"),price:e.value.doctor.personalizedPrices[0].personalizedPrice};const i=await n.addPayment(a.value);i.message?(d.add({severity:"error",summary:"Error",detail:i.message,life:4e3}),await n.deleteAppointmentId(n.appointment.appointmentId),Culqi.close()):(d.add({severity:"success",summary:"Éxito",detail:"Pago realizado correctamente",life:4e3}),Culqi.close(),setTimeout(()=>y.push("/quote/confirmation"),1e3))}),(o,i)=>{const g=p("Toast"),I=p("Button");return D(),x(N,null,[k,t("div",q,[m(g),t("div",z,[t("div",A,[t("div",Y,[t("p",w,"Medico : "+u(e.value?e.value.doctor.user.name+" "+e.value.doctor.user.surnames:"No disponible"),1),t("p",E,"Especialidad : "+u(e.value?e.value.doctor.specialization:"No disponible"),1),t("p",V,"Paciente : "+u(e.value?e.value.patient:"No disponible"),1),t("p",B,"Tipo de servicio : "+u(e.value?e.value.appointmentServices[0].medicalService.name:"No disponible"),1),t("span",null,"Fecha: "+u(e.value?C(v)(e.value.timeSlot.orderlyTurn,"DD MMMM YYYY hh:mm A"):"No disponible"),1),t("p",null,"Total: "+u(e.value?e.value.doctor.personalizedPrices[0].personalizedPrice:"No disponible"),1),m(I,{label:"Método de pago",icon:"pi pi-money-bill",class:"p-button-success col-12",disabled:c.value,loading:h.value,onClick:b},null,8,["disabled","loading"])])])])])],64)}}};export{K as default};
