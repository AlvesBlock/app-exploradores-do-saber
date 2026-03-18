# Audio: EcoNave

## Estrategia

O modulo usa `Web Audio API` com sintese simples para evitar dependencia de assets extras e manter inicializacao leve.

## Canais

- master
- sfx
- music

## Eventos sonoros cobertos

- tiro
- coleta correta
- erro pedagogico
- dano
- power-up
- alerta
- pulso de limpeza
- vitoria
- derrota
- boss

## Regras de ciclo de vida

- audio so tenta tocar apos `unlock()`
- falhas de autoplay nao quebram a partida
- pausa suspende o contexto
- retomada reativa o contexto
- troca de configuracao atualiza gains sem recriar toda a sessao
- `destroy()` encerra notas agendadas ao sair da tela

## Preferencias persistidas

- `muted`
- `musicMuted`
- `sfxVolume`
- `musicVolume`
