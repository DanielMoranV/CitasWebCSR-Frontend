import{_ as S,k,y as N,r as m,m as L,o as C,p as T,a as i,b as B,c as Y,d as t,e as o,q as s,j as d,t as c,B as z,v as R,x as V}from"./index-16712e5a.js";import{d as b}from"./day-a01efc22.js";const r=u=>(R("data-v-f91794d4"),u=u(),V(),u),A={class:"grid"},F={class:"col-12"},j={class:"card"},q={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},E=r(()=>t("h5",{class:"m-0"},"Lista de Médicos",-1)),O={class:"block mt-2 md:mt-0 p-input-icon-left"},$=r(()=>t("i",{class:"pi pi-search"},null,-1)),K=r(()=>t("span",{class:"p-column-title"},"DNI",-1)),U=r(()=>t("span",{class:"p-column-title"},"Nombre",-1)),G=r(()=>t("span",{class:"p-column-title"},"Apellidos",-1)),H=r(()=>t("span",{class:"p-column-title"},"Rol",-1)),J=r(()=>t("span",{class:"p-column-title"},"Precio",-1)),Q={__name:"Listdoctor",setup(u){const v=k(),_=N(),f=m(null),w=m(null),p=m({}),y=async n=>{_.doctor=n,z.setItem("doctor",n),await _.getInfoDoctor(n.user.Doctor.cmp),v.push("/quotes")},D=m({3:"Médico"});L(()=>{P()});const g=`listcolaborator-${b(new Date,"DD-MM-YYYY")}`;C(async()=>{await _.getDoctors().then(n=>{f.value=n.map(a=>{let h=b(a.user.birthDate,"DD MMMM YYYY");return a.user.birthDate=h,a.roleName=D.value[a.roleId],a})})});const P=()=>{p.value={global:{value:null,matchMode:T.CONTAINS}}};return(n,a)=>{const h=i("Toast"),x=i("InputText"),l=i("Column"),M=i("Button"),I=i("DataTable");return B(),Y("div",A,[t("div",F,[t("div",j,[o(h),o(I,{ref_key:"dt",ref:w,value:f.value,dataKey:"accessId",paginator:!0,rows:10,filters:p.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Mostrando {first} a {last} de {totalRecords} Colaboradores",responsiveLayout:"scroll",exportFilename:g},{header:s(()=>[t("div",q,[E,t("span",O,[$,o(x,{modelValue:p.value.global.value,"onUpdate:modelValue":a[0]||(a[0]=e=>p.value.global.value=e),placeholder:"Buscar..."},null,8,["modelValue"])])])]),default:s(()=>[o(l,{field:"user.dni",header:"DNI",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[K,d(" "+c(e.data.user.dni),1)]),_:1}),o(l,{field:"user.name",header:"Nombre",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[U,d(" "+c(e.data.user.name),1)]),_:1}),o(l,{field:"user.surnames",header:"Apellidos",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[G,d(" "+c(e.data.user.surnames),1)]),_:1}),o(l,{field:"user.Doctor.specialization",header:"Especialidad",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[H,d(" "+c(e.data.user.Doctor.specialization),1)]),_:1}),o(l,{field:"user.Doctor.personalizedPrices[0].personalizedPrice",header:"Precio Consulta",sortable:!0,headerStyle:"width:14%; min-width:10rem;"},{body:s(e=>[J,d(" "+c(e.data.user.Doctor.personalizedPrices[0].personalizedPrice),1)]),_:1}),o(l,{headerStyle:"min-width:10rem;",header:"Acciones"},{body:s(e=>[o(M,{icon:"pi pi-calendar-plus",class:"p-button-rounded p-button-info mr-2",onClick:W=>y(e.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","filters"])])])])}}},ee=S(Q,[["__scopeId","data-v-f91794d4"]]);export{ee as default};
