## General component for showing results from futball

It is a webcomponent for displaying the standings from a amateurteam in the Netherlands. It needs a clientId for sportlink and a pouleCode. This code can be as meta element or as property.

### meta
`<meta name="teamCode" content="[yourcontent]" />`
`<meta name="clientId" content="[yourcontent]" />`

### property
`<sportlink-stand clientId="[yourcontent]" teamCode="[yourcontent]"></sportlink-stand>`


### Properties

| Property    | Value |
| -------- | ------- |
| clientId  | [your_id] |
| teamCode  | [your_id] |
| titel  | titel from component |


### css vars

| Property    | Default Value |
| -------- | ------- |
| --sportlink-wedstrijd-tabel-header-font-weight | 600 |
| --sportlink-wedstrijd-eigenteam-font-weight | 600 |
| --sportlink-wedstrijd-tabel-font-family | inherit |
| --sportlink-wedstrijd-titel-font-family | inherit |
| --sportlink-wedstrijd-titel-font-weight | inherit |
| --sportlink-wedstrijd-titel-font-size | inherit |
| --sportlink-wedstrijd-titel-text-align | start |


### SLOTTED

| SLOTName | Position |
| slot="title" | Title above the players |
| slot="ally_title" | Title for table for accessibility |
| slot="nostandings" | When there are no standing |
| slot="error" | When something goes wrong |
