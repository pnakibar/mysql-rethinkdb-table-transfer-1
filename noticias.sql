SELECT ma.cd_matia as old_materia_cd,
    ma.cd_site as old_materia_cd_site,
    ma.id_matia as old_materia_id,
    ma.dt_matia_incl as old_materia_data_inclusao,
    ma.cd_usuas_incl as old_materia_cd_usuario_inclusao,
    ma.dt_matia_alter as old_materia_data_alteracao,
    ma.cd_usuas_alter as old_materia_matia_cd_usuarios_alterados,
    ma.qt_matia_visua as old_materia_quantidade_visualizacoes,
    ma.id_matia_tipo as old_materia_id_tipo,
    ma.cd_matia_statu as old_materia_cd_status,
    ma.id_matia_comen as old_materia_id_comentario,
    ma.qt_matia_comen as old_materia_qtd_comentario,
    ma.qt_matia_estre as old_materia_estre, -- TODO: o que é isso?
    ma.qt_matia_voto as old_materia_quatidade_voto,
    ma.qt_matia_bom as old_materia_quantidade_voto_bom,
    ma.qt_matia_ruim as old_materia_quantiade_voto_ruim,
    ma.ds_matia_palvr as old_materia_palavra, -- TODO: ???
    ma.ds_matia_link as old_materia_link,
    ma.dt_matia_publi as old_materia_data_publicacao,
    ma.dt_matia_dead as old_materia_data_dead, -- TODO: ???
    ma.cd_usuas_ref as old_materia_usuario_ref, -- TODO: ??
    ma.dt_matia_ref as old_materia_data_ref, -- TODO: ???
    ma.id_matia_twitt as old_materia_id_twitt, -- TODO: twitter?
    ma.dt_matia_twitt as old_materia_data_twitt, -- TODO: twitter?
    ma.cd_tetag as old_materia_tetag, -- TODO: tetag??
    ma.cd_tammi as old_materia_tammi, -- TODO: tammi?
    ma.id_matia_midia_h as old_materia_midia_h, -- TODO: h?
    ma.id_matia_midia_w as old_materia_midia_w, -- TODO: w?
    ma.ds_matia_midia_credi as old_materia_midia_credi, -- TODO: credi?
    ma.ds_matia_midia as old_materia_midia, -- TODO:???
    ma.ds_matia_var1 as old_materia_var1, --  todo: ???
    ma.ds_matia_var2 as old_materia_var2, --  todo: ???
    ma.ds_matia_var3 as old_materia_var3, --  todo: ???
    ma.ds_matia_var4 as old_materia_var4, --  todo: ???
    ma.ds_matia_var5 as old_materia_var5, --  todo: ???
    ma.ds_matia_var6 as old_materia_var6, --  todo: ???
    ma.nm_matia as old_materia_nm, -- todo: nm?
    ma.ds_matia_assun as old_materia_assunto,
    ma.ds_matia_titlo as old_materia_titulo,
    ma.ds_matia_chape as old_materia_chape, -- TODO: não é chape, é chamada, alguma coisa do tipo.
    ma.ds_matia_grata as old_materia_grata, -- TODO: não é grata, é capa, imagem, cartaz
    ma.ds_matia as old_materia_ds, -- TODO: ????????
    ma.id_matia_exter as old_materia_id_exter, -- ???
    ma.cd_jonal as old_materia_jornal_cd, -- ???
    ma.cd_edcao as old_materia_edicao, -- ???
    ma.dt_matia_edcao as old_materia_data_edicao, -- TODO: ???
    ma.cd_edria as old_materia_edria_cd, -- ???
    ma.vl_matia_edria_pagin as old_materia_vl_edria_pagin, -- ???
    ma.vl_matia_edria_pagin_sesin as old_materia_vl_edria_pagin_sesin, -- ???
    ma.ds_matia_edria_pagin as old_materia_ds_edria_pagin, -- ???
    ma.id_matia_impre_trava as old_materia_id_impre_trava, -- ???
    ma.id_matia_edcao_exclu as old_materia_id_edcao_exclu, -- ???
    ma.dt_matia_gerad as old_materia_dt_gerad, -- ???
    ma.cd_catst as old_materia_catst, -- ???
    ma.id_matia_fee as old_materia_fee_id, -- ???
    ma.ds_matia_fee as old_materia_fee_ds, -- ???
    ma.ds_matia_path as old_materia_path,
    ma.ds_matia_path_encur as old_materia_path_encurtado,
    ma.id_matia_euaqu as old_materia_euaqu, -- ???
    ma.id_matia_galer as old_materia_galer, -- ???
    ma.dt_matia_pdmat as old_materia_data_pdmat, -- ???
    ma.dt_matia_alter_form as old_materia_data_alter_form, -- ???
    ma.id_matia_not_publi as old_materia_not_publicada, -- ???
    ma.ds_matia_cor as old_materia_cor, -- ???
    ma.id_matia_gerad_lazy as old_materia_gerad_lazy, -- ???
    ma.id_matia_press_alert as old_materia_press_alert_id, -- ???
    ma.cd_matia_press_alert as old_materia_press_alert_cd, -- ???
    ma.id_matia_video as old_materia_video_id, -- ???
    ma.id_matia_audio as old_materia_audio_id, -- ???
    ma.id_matia_agenc as old_materia_agenc_id, -- ???
    ma.cd_matia_pai as old_materia_pai_cd, -- ???
    ma.dt_matia_publi_html as old_materia_publi_html_dt, -- ???
    ma.cd_prded as old_materia_prded , -- ???
    ma.cd_pdcao as old_materia_pdcao , -- ???
    ma.dt_matia_edcao_publi as old_materia_edcao_publi_dt , -- ???
    ma.dt_matia_pdcao_liber as old_materia_pdcao_liber_dt , -- ???
    ma.cd_matia_pdcao_liber_usuas as old_materia_pdcao_liber_usuas_cd , -- ???
    ma.cd_matia_usuas_resp as old_materia_usuas_resp_cd , -- ???
    ma.id_matia_adian as old_materia_adian_id,  -- ???
    ma.id_matia_pauta_ordem as old_materia_pauta_ordem_id , -- ???
    ma.qt_matia_pavra as old_materia_pavra_qt , -- ???
    ma.qt_matia_cater as old_materia_cater_qt , -- ???
    ma.ds_matia_ender as old_materia_ender_ds , -- ???
    ma.ds_matia_ciade as old_materia_ciade_ds , -- ???
    ma.cd_agnpt as old_materia_agnpt_cd , -- ???
    ma.ds_matia_lat as old_materia_latitude , -- ???
    ma.ds_matia_lng as old_materia_longitute , -- ???
    ma.id_matia_espec as old_materia_espec_id, -- ???
    ma.cd_templ_matia as old_materia_templ_cd, -- ???
    ma.cd_matia_orig as old_materia_original_cd , -- ???
    ma.id_matia_auto as old_materia_automatica, -- ???
    ma.cd_usuas_desvi as old_materia_usuario_desvi, -- ???
    ma.ds_matia_cor2 as old_materia_cor2, -- ???
    -- midia
    mi.cd_midia as old_midia_cd,
    mi.cd_jonal as old_midia_jornal_cd,
    mi.cd_tpmid as old_midia_cd_tpmid,
    mi.cd_tammi as old_midia_cd_tammi,
    mi.dt_midia_incl as old_midia_dt_midia_incl,
    mi.dt_midia_ref as old_midia_dt_midia_ref,
    mi.ds_midia_titlo as old_midia_ds_midia_titulo,
    mi.ds_midia_palvr as old_midia_ds_midia_palvra,
    mi.ds_midia_credi as old_midia_ds_midia_credi,
    mi.nm_midia as old_midia_nm,
    mi.ds_midia as old_midia_ds,
    mi.nm_midia_inter as old_midia_nm_inter,
    mi.qt_midia_klbit as old_midia_qt_klbit,
    mi.qt_midia_estre as old_midia_qt_estre,
    mi.qt_midia_voto as old_midia_qt_voto,
    mi.cd_sisma as old_midia_cd_sisma,
    mi.cd_poral as old_midia_cd_poral,
    mi.cd_midia_pai as old_midia_cd_pai,
    mi.id_midia_galer as old_midia_id_galer,
    mi.cd_site as old_midia_cd_site,
    mi.id_midia_tipo as old_midia_id_midia_tipo,
    mi.id_midia as old_midia_id_midia,
    mi.id_midia2 as old_midia_id_midia2,
    mi.id_midia_aprov as old_midia_id_aprov,
    mi.id_midia_restr as old_midia_id_restr,
    mi.id_midia_lote as old_midia_id_lote,
    mi.cd_usuas as old_midia_cd_usuas,
    mi.id_midia_armnv as old_midia_id_armnv,
    mi.nm_midia_inter_thumb1 as old_midia_nm_inter_thumb1,
    mi.nm_midia_inter_thumb2 as old_midia_nm_inter_thumb2,
    mi.nm_midia_inter_thumb3 as old_midia_nm_inter_thumb3,
    mi.nm_midia_inter_orig as old_midia_nm_inter_orig,
    mi.dt_midia_exclu as old_midia_dt_exclu,
    mi.ds_midia_url as old_midia_ds_url,
    mi.ds_midia_link as old_midia_ds_link,
    mi.cd_midia_h as old_midia_cd_h,
    mi.cd_midia_w as old_midia_cd_w,
    mi.qt_midia_durac as old_midia_qt_durac,
    mi.cd_campa as old_midia_cd_campa,
    mi.dt_midia_proce as old_midia_dt_proce,
    mi.id_midia_fnews as old_midia_id_fnews,
    mi.ds_midia_fnews_srver_path as old_midia_ds_fnews_srver_path,
    mi.ds_midia_fnews_netwk_path as old_midia_ds_fnews_netwk_path,
    mi.id_midia_fnews_w as old_midia_id_fnews_w,
    mi.id_midia_fnews_h as old_midia_id_fnews_h,
    mi.qt_midia_fnews_durac as old_midia_qt_fnews_durac,
    mi.dt_midia_edcao as old_midia_dt_edcao,
    mi.cd_edria as old_midia_cd_edria,
    mi.id_midia_trata_proce as old_midia_id_trata_proce,
    mi.dt_midia_proce_ini as old_midia_dt_proce_ini,
    mi.dt_midia_proce_fim as old_midia_dt_proce_fim,
    mi.id_midia_trata_manua as old_midia_id_trata_manua,
    mi.ds_midia_trata_manua as old_midia_ds_trata_manua,
    mi.cd_usuas_manua as old_midia_cd_manua,
    mi.dt_midia_manua_fim as old_midia_dt_manua_fim,
    mi.cd_usuas_manua_fim as old_midia_cd_manua_fim,
    mi.id_midia_comer as old_midia_id_comer,
    mi.cd_midia_exter as old_midia_cd_exter,
    mi.cd_fldmd as old_midia_cd_fldmd,
    mi.cd_usuas_aprov as old_midia_cd_usuas_aprov,
    mi.cd_usuas_aprov_reali as old_midia_cd_usuas_aprov_reali,
    mi.dt_midia_aprov as old_midia_dt_midia_aprov,
    mi.id_midia_pai as old_midia_id_midia_pai,
    mi.ds_midia_tag as old_midia_ds_midia_tag,
    -- edria
    edr.cd_edria as old_edria_cd,
    edr.cd_edria_pai as old_edria_cd_pai,
    edr.cd_jonal as old_edria_cd_jonal,
    edr.nm_edria as old_edria_nm_edria,
    edr.qt_edria_pagin as old_edria_qt_pagin,
    edr.qt_edria_conte as old_edria_qt_conte,
    edr.ds_edria_sql as old_edria_ds_sql,
    edr.ds_edria_prefi_arquv as old_edria_ds_prefi_arquv,
    edr.ds_edria_mask_arquv as old_edria_ds_mask_arquv,
    edr.id_edria_pdf_box as old_edria_id_pdf_box,
    edr.vl_edria_width as old_edria_vl_width,
    edr.vl_edria_heigh as old_edria_vl_heigh,
    edr.vl_edria_width_mm as old_edria_vl_width_mm,
    edr.vl_edria_heigh_mm as old_edria_vl_heigh_mm,
    edr.cd_prded as old_edria_cd_prded,
    edr.id_edria_exter as old_edria_id_exter,
    edr.ds_edria_sigla as old_edria_ds_sigla,
    -- jonal
    jo.cd_jonal as old_jornal_cd,
    jo.cd_poral as old_jornal_cd_poral,
    jo.ds_jonal as old_jornal_ds,
    jo.ds_jonal_logo as old_jornal_ds_logo,
    jo.qt_jonal_edcao as old_jornal_qt_edicao,
    jo.ds_jonal_path as old_jornal_ds_path,
    jo.ds_jonal_token as old_jornal_ds_token,
    jo.id_jonal_free as old_jornal_id_free,
    jo.ds_jonal_sobre_url as old_jornal_ds_sobre_url,
    jo.ds_jonal_assin_url as old_jornal_ds_assinatura_url,
    jo.qt_jonal_matia_free as old_jornal_qt_materia_free,
    jo.ds_jonal_sende as old_jornal_ds_sende,
    jo.ds_jonal_subje as old_jornal_ds_subject,
    jo.ds_jonal_messa as old_jornal_ds_message,
    jo.ds_jonal_assin as old_jornal_ds_assinatura,
    jo.ds_jonal_msg_boasv as old_jornal_ds_msg_boasv,
    jo.ds_jonal_soap_url as old_jornal_ds_soap_url,
    jo.id_jonal_analy_profi as old_jornal_id_analy_profi,
    jo.ds_jonal_ftp_user as old_jornal_ds_ftp_user,
    jo.ds_jonal_ftp_passw as old_jornal_ds_ftp_passw,
    jo.ds_jonal_logo_flip as old_jornal_ds_logo_flip,
    jo.vl_jonal_width as old_jornal_vl_width,
    jo.vl_jonal_heigh as old_jornal_vl_heigh,
    jo.vl_jonal_width_mm as old_jornal_vl_width_mm,
    jo.vl_jonal_heigh_mm as old_jornal_vl_heigh_mm,
    jo.ds_jonal_senha_url as old_jornal_ds_senha_url,
    jo.ds_jonal_recup_subje as old_jornal_ds_recup_subje,
    jo.ds_jonal_recup_messa as old_jornal_ds_recup_messa,
    jo.qt_jonal_limit_dispo as old_jornal_qt_limit_disponivel,
    jo.id_jonal_pdf_box as old_jornal_id_pdf_box,
    jo.cd_midia as old_jornal_cd_midia,
    jo.ds_jonal_authe_url as old_jornal_ds_authe_url,
    jo.ds_jonal_email_relat as old_jornal_ds_email_relat,
    jo.ds_jonal_flip_url as old_jornal_ds_flip_url,
    jo.ds_jonal_logo_assin as old_jornal_ds_logo_assin,
    jo.ds_jonal_fwall_plans as old_jornal_ds_fwall_plans,
    jo.ds_jonal_flip_fwall_banca as old_jornal_ds_flip_fwall_banca,
    jo.ds_jonal_flip_fwall_leia as old_jornal_ds_flip_fwall_leia,
    jo.ds_jonal_flip_bgcor as old_jornal_ds_flip_bgcor,
    jo.ds_jonal_flip_dfp as old_jornal_ds_flip_dfp,
    jo.qt_jonal_flip_dfp as old_jornal_qt_flip_dfp,
    jo.id_jonal_flip_exib as old_jornal_id_flip_exib,
    -- pdcao
    pd.cd_pdcao as old_producao_cd_,
    pd.cd_pdcao_pai as old_producao_cd_pai,
    pd.cd_edcao as old_producao_cd_edicao,
    pd.cd_stred as old_producao_cd_stred,
    pd.cd_statu as old_producao_cd_status,
    pd.cd_tplat as old_producao_cd_tplat,
    pd.vl_pdcao_stred as old_producao_vl_stred,
    pd.vl_pdcao_pagin as old_producao_vl_pagin,
    pd.vl_pdcao_tplat as old_producao_vl_tplat,
    pd.ds_pdcao_arquv as old_producao_ds_arquv,
    pd.ds_pdcao_arquv_indes as old_producao_ds_arquv_indes,
    pd.ds_pdcao_arquv_extern as old_producao_ds_arquv_extern,
    pd.id_pdcao_statu_proce as old_producao_id_statu_proce,
    pd.no_pdcao_revis as old_producao_no_revis,
    pd.ds_pdcao_text as old_producao_ds_text,
    pd.id_pdcao_peb as old_producao_id_peb,
    pd.dt_pdcao_fecha_prev as old_producao_dt_fecha_prev,
    pd.dt_pdcao_fecha as old_producao_dt_fecha,
    pd.cd_usuas as old_producao_cd_usuarios,
    pd.dt_pdcao_exclu as old_producao_dt_exclu,
    pd.cd_usuas_exclu as old_producao_cd_usuas_exclu,
    pd.qt_pdcao_pagin as old_producao_qt_pagin,
    pd.no_pdcao_pagin as old_producao_no_pagin,
    pd.ds_pdcao_nome as old_producao_ds_nome,
    -- prded
    pr.cd_prded as old_prded_cd,
    pr.cd_jonal as old_prded_cd_jonal,
    pr.id_prded_exter as old_prded_id_exter,
    pr.ds_prded as old_prded_ds,
    pr.id_prded_multi as old_prded_id_multi,
    pr.id_prded_ordem as old_prded_id_ordem,
    pr.id_prded_nopos as old_prded_id_nopos,
    pr.tm_prded_fecha as old_prded_tm_fecha,
    pr.qt_prded_fecha_dias as old_prded_qt_fecha_dias,
    -- site
    si.cd_site as old_site_cd,
    si.id_site_exter as old_site_id_exter,
    si.cd_poral as old_site_cd_poral,
    si.cd_site_pai as old_site_cd_site_pai,
    si.cd_tpgui as old_site_cd_tpgui,
    si.cd_guia as old_site_cd_guia,
    si.ds_site as old_site_ds,
    si.ds_site_compl as old_site_ds_compl,
    si.id_site_nivel as old_site_id_nivel,
    si.cd_site_url_capa as old_site_cd_url_capa,
    si.cd_site_url_matia as old_site_cd_url_matia,
    si.ds_site_arvor as old_site_ds_arvor,
    si.id_site_oflin as old_site_id_oflin,
    si.id_site_tipo as old_site_id_tipo,
    si.id_site_menu as old_site_id_menu,
    si.id_site_comen as old_site_id_comen,
    si.id_site_tptop as old_site_id_tptop,
    si.id_site_comen_modra as old_site_id_comen_modra,
    si.id_site_posme as old_site_id_posme,
    si.id_site_edica as old_site_id_edica,
    si.ds_site_edica as old_site_ds_edica,
    si.cd_jonal as old_site_cd_jonal,
    si.cd_edria as old_site_cd_edria,
    si.cd_templ as old_site_cd_templ,
    si.cd_templ_capa as old_site_cd_templ_capa,
    si.id_site_rss as old_site_id_rss,
    si.id_site_rss_cmpto as old_site_id_rss_cmpto,
    si.ds_site_title as old_site_ds_title,
    si.ds_site_title_capa as old_site_ds_title_capa,
    si.id_site_palvr as old_site_id_palvr,
    si.ds_site_palvr as old_site_ds_palvr,
    si.id_site_rdrect as old_site_id_rdrect,
    si.ds_site_rdrect as old_site_ds_rdrect,
    si.id_site_refre as old_site_id_refre,
    si.ds_site_var1 as old_site_ds_var1,
    si.ds_site_var2 as old_site_ds_var2,
    si.ds_site_var3 as old_site_ds_var3,
    si.ds_site_var4 as old_site_ds_var4,
    si.ds_site_var5 as old_site_ds_var5,
    si.ds_site_var6 as old_site_ds_var6,
    si.ds_site_twitt_login as old_site_ds_twitt_login,
    si.ds_site_twitt_senha as old_site_ds_twitt_senha,
    si.ds_site_twitt as old_site_ds_twitt,
    si.dt_site_gerad as old_site_dt_gerad,
    si.dt_site_alter as old_site_dt_alter,
    si.dt_site_dynam as old_site_dt_dynam,
    si.qt_site_gerad as old_site_qt_gerad,
    si.id_site_mobil as old_site_id_mobil,
    si.ds_site_path as old_site_ds_path,
    si.cd_midia1 as old_site_cd_midia1,
    si.ds_site_midia1_link as old_site_ds_midia1_link,
    si.cd_midia2 as old_site_cd_midia2,
    si.ds_site_midia2_link as old_site_ds_midia2_link,
    si.cd_midia3 as old_site_cd_midia3,
    si.ds_site_midia3_link as old_site_ds_midia3_link,
    si.cd_site_menu as old_site_cd_menu,
    si.ds_site_email as old_site_ds_email,
    si.id_site_fee as old_site_id_fee,
    si.ds_site_fee as old_site_ds_fee,
    si.id_site_publi_multi as old_site_id_publi_multi,
    si.id_site_cor as old_site_id_cor,
    si.id_site_bgpub as old_site_id_bgpub,
    si.dt_site_horar as old_site_dt_horar,
    si.id_site_fwall as old_site_id_fwall,
    si.ds_site_adsense as old_site_ds_adsense,
    si.dt_site_horar_fim as old_site_dt_horar_fim,
    -- tammi
    ta.cd_tammi as old_tammi_cd,
    ta.cd_sisma as old_tammi_cd_sisma,
    ta.cd_poral as old_tammi_cd_poral,
    ta.ds_tammi as old_tammi_ds,
    ta.ds_tammi_compl as old_tammi_ds_compl,
    ta.id_tammi_tipo as old_tammi_id_tipo,
    ta.cd_tammi_h as old_tammi_cd_h,
    ta.cd_tammi_w as old_tammi_cd_w,
    ta.vl_tammi_razao as old_tammi_vl_razao,
    ta.id_tammi_galer as old_tammi_id_galer,
    ta.id_tammi_thumb as old_tammi_id_thumb,
    ta.id_tammi_defau as old_tammi_id_defau,
    ta.id_tammi_ativo as old_tammi_id_ativo,
    -- tetag
    te.cd_sisma as old_tetag_cd_sisma,
    te.cd_poral as old_tetag_cd_poral,
    te.cd_tetag as old_tetag_cd,
    te.id_tetag_tipo as old_tetag_id_tipo,
    te.id_tetag_galer as old_tetag_id_galer,
    te.ds_tetag as old_tetag_ds,
    te.ds_tetag_tag_html as old_tetag_ds_tag_html,
    te.qt_tetag_midia as old_tetag_qt_midia,
    te.id_tetag_templ_tipo as old_tetag_id_templ_tipo,
    -- usuarios
    us.cd_usuas as old_usuarios_cd,
    us.nm_usuas as old_usuarios_nm,
    us.cd_empre as old_usuarios_cd_empre,
    us.ds_usuas_matri as old_usuarios_ds_matri,
    us.ds_usuas_email as old_usuarios_ds_email,
    us.ds_usuas_login as old_usuarios_ds_login,
    us.cd_usuas_senha as old_usuarios_cd_senha,
    us.id_usuas_statu as old_usuarios_id_statu,
    us.id_usuas_sisma as old_usuarios_id_sisma,
    us.cd_usuas_respo as old_usuarios_cd_respo,
    us.cd_usuas_senha_plain as old_usuarios_cd_senha_plain,
    us.id_usuas_acext as old_usuarios_id_acext,
    us.cd_gusis as old_usuarios_cd_gusis,
    no.cd_matia as old_noticia_cd,
    no.nm_notia_autor as old_noticia_nm_autor,
    no.ds_notia_autor_email as old_noticia_ds_autor_email,
    no.nm_notia_fonte as old_noticia_nm_fonte,
    no.ds_notia_fonte_url as old_noticia_ds_fonte_url
FROM matia ma
  LEFT JOIN midia mi ON ma.cd_midia = mi.cd_midia
  LEFT JOIN edcao ed ON ma.cd_edcao = ed.cd_edcao
  LEFT JOIN edria edr ON ma.cd_edria = edr.cd_edria
  LEFT JOIN jonal jo ON ma.cd_jonal = jo.cd_jonal
  LEFT JOIN pdcao pd ON ma.cd_pdcao = pd.cd_pdcao
  LEFT JOIN prded pr ON ma.cd_prded = pr.cd_prded
  LEFT JOIN site si ON ma.cd_site = si.cd_site
  LEFT JOIN tammi ta ON ma.cd_tammi = ta.cd_tammi
  LEFT JOIN tetag te ON ma.cd_tetag = te.cd_tetag
  LEFT JOIN usuas us ON ma.cd_usuas_alter = us.cd_usuas
  LEFT JOIN notia no ON ma.cd_matia = no.cd_matia
WHERE ma.id_matia_tipo = 1
