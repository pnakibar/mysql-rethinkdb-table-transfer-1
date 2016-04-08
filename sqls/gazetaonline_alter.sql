SELECT
    log.cd_logfe_table_chave,
    mat.id_matia_tipo
FROM
    logfe log
        INNER JOIN
    matia mat ON log.cd_logfe_table_chave = mat.cd_matia
WHERE
    log.nm_logfe_table = 'matia'
        AND log.ds_logfe_acao IN ('UPDATE' , 'DELETE')