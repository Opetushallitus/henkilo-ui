export const KAYTTOOIKEUDENTILA = {
    HYLATTY: 'HYLATTY',
    UUSITTU: 'UUSITTU',
    ANOTTU: 'ANOTTU',
    SULJETTU: 'SULJETTU',
    MYONNETTY: 'MYONNETTY',
    PERUUTETTU: 'PERUUTETTU',
    VANHENTUNUT: 'VANHENTUNUT',
} as const;

export type KayttooikeudenTila = keyof typeof KAYTTOOIKEUDENTILA;
