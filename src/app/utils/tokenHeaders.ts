import { HttpHeaders } from '@angular/common/http';

const getToken = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
        return 'Bearer ' + JSON.parse(user).token;
    }
    return '';
}

export const headers = new HttpHeaders({
    'Authorization': getToken(),
    'Content-Type': 'application/json'
});