# Récupérer le projet
Télécharger manuellement le repo en local


# Dépendances
```
yarn add vue vuelidate vuelidate-error-extractor
yarn add https://bitbucket.org/adeliomgit/dauphine-js.git
```

# Exemple codesandbox
https://codesandbox.io/s/formulaire-multi-etapes-xsx4x


# Configuration données .json
Exemple 1 :
```
{
    "question": "Quel produit vous intéresse&nbsp;?",
    "name": "product", => Nom du champ, celui-ci sera envoyé lors de la requête AJAX vers l'API
    "nextStep": "step-2", => correspond au nom du fichier pour la seconde étape
    "url": "etape-1", => url de l'étape
    "summary" : "Votre produit", => Titre du résumé / sommaire disponible sur la prochaine étape
    "multiple": false, => True = Checkbox ; False = Radio
    "answers": [
        {
            "label": "Véranda",
            "value": "Véranda"
        },
        {
            "label": "Pergola classique",
            "value": "Pergola classique",
            "nextStep": "step-3" => Je peux surcharger l'étape suivante selon un choix (non obligatoire)
        }
    ] => Choix uniques sous forme de bouton radio ou checkbox selon l'option "multiple"
}
```

Exemple 2 :
```
{
    "question": "Facultatif : Racontez-nous votre projet",
    "url": "etape2",
    "nextStep": "step-3",
    "summary" : "Votre projet",
    "fields": [
        {
            "type": "textarea",
            "name": "message",
            "required": true,
            "full": true,
            "class": "",
            "label": "Votre projet",
            "placeholder": "Décrivez votre projet",
            "conditional": {
                "key": "situation", => nom du champ d'une étape précédente
                "value": "Geschäftskunden" => valeur renseignée
            }, => champ conditionel selon une valeur d'une étape précédente
        }
    ]
}
```
