<#ftl output_format="plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#items></#list><#else></#if></#assign>

<#if  requiredActions?seq_contains("UPDATE_PASSWORD")>
${msg("inviteBody", user.firstName, link)}
<#else>
${msg("executeActionsBody",link, linkExpiration, realmName, requiredActionsText, linkExpirationFormatter(linkExpiration))}
</#if>