import { animate, style, transition, trigger } from '@angular/animations';

const animationDuration = '350ms';

export const slide = trigger('slide', [
    transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate(`${animationDuration} ease-in`, style({transform: 'translateX(0%)'})),
    ]),
    transition(':leave', [
        animate(`${animationDuration} ease-out`, style({transform: 'translateX(100%)'}))
    ])
]);

export const expand = trigger('expand', [
    transition(':enter', [
        style({
            overflow: 'hidden',
            height: '0',
        }),
        animate(`${animationDuration} ease-in`, style({
            overflow: 'hidden',
            height: '{{ height }}',
        }))
    ]),

    transition(':leave', [
        animate(`${animationDuration} ease-out`, style({
            overflow: 'hidden',
            height: '0',
        }))
    ])
]);
