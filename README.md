## Vejr-app

I denne opgave skal du lave en simpel hjemmeside, hvor man kan søge på en by og få temperaturen.  
Du skal bruge **OpenWeatherMap (OWM) API** til at hente vejrdata fra deres servere.

### How to run

rename `.env.example` to `.env`

insert your api key into `.env`

> [!NOTE]
> you can replace bun with npm or your desired package manager


install dependencies
```sh
bun i --frozen-lockfile
```

run the app in dev
```sh
bun run dev
```

building
```sh
bun run build
```

serving
> [!WARNING]
> in a production environment you should use a reverse proxy like caddy or nginx
```sh
bun run preview
```


### Trin-for-trin:

1. **[Opret en gratis konto](https://home.openweathermap.org/users/sign_up)** på OWM og få en **API-nøgle**.
2. Lav et **inputfelt**, hvor brugeren kan indtaste navnet på en by.
3. Lav en funktion, der sender en forespørgsel til **[OWM Geocoding API](https://openweathermap.org/api/geocoding-api)** Du vil modtage et svar med de geografiske koordinater (bredde- og længdegrad) for den valgte by.
4. Lav en anden funktion, der sender en forespørgsel til **[OWM Current Weather API](https://openweathermap.org/current)** med:
   - De geografiske koordinater
   - Din API-nøgle  
   Du vil modtage et svar med aktuelle vejrdata for den valgte by, herunder temperaturen.
5. **Vis temperaturen** på hjemmesiden sammen med:
   - Bynavn
   - Eventuelt et passende ikon eller billede for vejret (se Weather Icons)
6. **Test din hjemmeside** og sørg for, at den virker for forskellige byer og håndterer eventuelle fejl eller ugyldige input.

### Aflevering:
- Push til GitHub og husk pull request til main
