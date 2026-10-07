import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    vus: 200,
    iterations: 200,
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN; // Pass via environment

export default function () {
    const res = http.post(
        `${BASE_URL}/api/v1/orders`,
        JSON.stringify({ shippingAddress: '123 Test St' }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
                'Idempotency-Key': uuidv4(),
            },
        }
    );
    check(res, {
        'is 201 or 409': (r) => r.status === 201 || r.status === 409,
    });
}
