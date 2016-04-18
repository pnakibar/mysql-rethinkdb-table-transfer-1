SELECT
    mat.cd_matia,
    log.cd_logfe
FROM
    logfe log
    INNER JOIN matia mat ON log.cd_logfe_table_chave = mat.cd_matia
WHERE
    (log.nm_logfe_table in ('matia')
        AND log.ds_logfe_acao IN ('UPDATE' , 'DELETE'))
union all

SELECT
    matia.cd_matia,
    log.cd_logfe
FROM
    logfe log
    INNER JOIN midma ON log.cd_logfe_table_chave = midma.cd_midma
    INNER JOIN matia ON matia.cd_matia = midma.cd_matia
WHERE
    (log.nm_logfe_table in ('midma')
        AND log.ds_logfe_acao IN ( 'INSERT', 'UPDATE' , 'DELETE'))

union all
SELECT
    matia.cd_matia,
    log.cd_logfe

FROM
    logfe log
    INNER JOIN autmt ON log.cd_logfe_table_chave = autmt.cd_autmt
    INNER JOIN matia ON matia.cd_matia = autmt.cd_matia
WHERE
    (log.nm_logfe_table in ('autmt')
        AND log.ds_logfe_acao IN ( 'INSERT', 'UPDATE' , 'DELETE'))
