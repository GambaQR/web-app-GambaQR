import { trigger, state, style, transition, animate } from '@angular/animations';

export const flyoutMenu = trigger('flyoutMenu', [
    state('hidden', style({
        opacity: 0,
        transform: 'translateY(1rem)'
    })),
    state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
    })),
    transition('hidden => visible', [
        animate('200ms ease-out')
    ]),
    transition('visible => hidden', [
        animate('150ms ease-in')
    ])
]);

export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
    ])
]);

export const slideFromRight = trigger('slideFromRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('300ms ease-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      animate('300ms ease-in', style({ transform: 'translateX(100%)' })) 
    ])
  ]);

  export const fadeBackground = trigger('fadeBackground', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('400ms ease-in-out', style({ opacity: 1 })) 
    ]),
    transition(':leave', [
      animate('400ms ease-in-out', style({ opacity: 0 })) 
    ])
  ]);