# Mapeamento de Campos Customizados do Kommo

## Campos de Tracking UTM

| Campo        | Field ID | Tipo          | Descrição         |
| ------------ | -------- | ------------- | ----------------- |
| utm_content  | 531866   | tracking_data | Conteúdo UTM      |
| utm_medium   | 531868   | tracking_data | Meio UTM          |
| utm_campaign | 531870   | tracking_data | Campanha UTM      |
| utm_source   | 531872   | tracking_data | Fonte UTM         |
| utm_term     | 531874   | tracking_data | Termo UTM         |
| utm_referrer | 531876   | tracking_data | Referrer UTM      |
| referrer     | 531878   | tracking_data | Referrer          |
| gclientid    | 531880   | tracking_data | Google Client ID  |
| gclid        | 531882   | tracking_data | Google Click ID   |
| fbclid       | 531884   | tracking_data | Facebook Click ID |

## Campos de Negócio

### Banco (Field ID: 789592)

| Valor  | Enum ID |
| ------ | ------- |
| SOLLO  | 656280  |
| BRCRED | 656282  |
| SICOOB | 656284  |
| CBSERV | 656286  |
| GCARD  | 656288  |

### Produto (Field ID: 789594)

| Valor           | Enum ID |
| --------------- | ------- |
| CARNÊ           | 656290  |
| DÉBITO EM CONTA | 656292  |
| CONSIGNADO      | 656294  |
| BOLETO          | 656296  |

### Prazo (Field ID: 789648)

| Valor | Enum ID |
| ----- | ------- |
| 96X   | 656328  |
| 84X   | 656330  |
| 48X   | 656332  |
| 12X   | 657702  |
| 06X   | 657704  |
| 10X   | 657706  |
| 60X   | 657708  |
| 78X   | 657710  |

### Origem (Field ID: 789656)

| Valor      | Enum ID |
| ---------- | ------- |
| GOOGLE     | 656334  |
| FACEBOOK   | 656336  |
| TIKTOK     | 656338  |
| TABOOLA    | 656340  |
| KWAI       | 656342  |
| INDICAÇÃO  | 656496  |
| PRESENCIAL | 656498  |
| CB BRAZIL  | 656500  |

### Associação (Field ID: 790112)

| Valor | Enum ID |
| ----- | ------- |
| ASDF  | 656822  |

### Regime (Field ID: 790114)

| Valor        | Enum ID |
| ------------ | ------- |
| Comissionado | 656824  |
| Estatutário  | 656826  |
| Jurídico     | 656828  |
| Temporário   | 656830  |
| CLT          | 656832  |

## Campos de Texto

| Campo             | Field ID | Tipo | Descrição            |
| ----------------- | -------- | ---- | -------------------- |
| contrato          | 789644   | text | Número do Contrato   |
| taxa_servico      | 789646   | text | Taxa de Serviço      |
| prestacao_servico | 789650   | text | Prestação de Serviço |
| comissao_banco    | 789652   | text | Comissão do Banco    |
| repasse_parceiro  | 789654   | text | Repasse Parceiro     |
| parcela           | 789800   | text | Parcela              |
| margem            | 789802   | text | Margem               |
