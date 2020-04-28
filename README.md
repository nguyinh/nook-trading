Routes
Contains all routes (GET, POST ...)

Controllers
Contains all functions used by routes
Calls services, manipulate data, then send response to front-end

Services
Contains calls to external services or databases with selectors

Models
Contains all schema models for MongoDB



Front-end
  pages/
  contains all main pages (Market, Profile, Turnip-trend/cours navet)

  components/
  contains all components used by pages or components itselves

  contexts/
  contains global data (user account)

  res/
  contains resources such as images, fonts

  services/
  contains external calls to back-end


1) Recuperer toute la DB NookItem allégée (juste nom et prix)
   Filter sur le front-end
   Quand t'as trouvé, tu request la DB
   => perf front-end bof

OR

2) Envoyer l'input avec query sur le back-end
   Back-end request la DB avec l'input
   => temps réel bof