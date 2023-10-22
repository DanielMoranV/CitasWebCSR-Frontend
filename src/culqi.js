function culqi() {
    if (Culqi.token) {
        const token = Culqi.token.id;
        console.log('Se ha creado un Token: ', token);

        // En este punto, puedes manejar el token según tus necesidades
        // Por ejemplo, puedes realizar una solicitud Ajax para enviar el token al servidor
    } else if (Culqi.order) {
        const order = Culqi.order;
        console.log('Se ha creado el objeto Order: ', order);
    } else {
        console.error('Error: ', Culqi.error);
    }
}
