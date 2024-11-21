<#import "template.ftl" as layout>
<@layout.emailLayout>
<#if  requiredActions?seq_contains("UPDATE_PASSWORD")>
${kcSanitize(msg("inviteBodyHtml", user.firstName, link, linkExpirationFormatter(linkExpiration), "${properties.applicationURL}", user.email ))?no_esc}
<#else>
${kcSanitize(msg("executeActionsBodyHtml",link, linkExpiration, realmName, requiredActionsText, linkExpirationFormatter(linkExpiration)))?no_esc}
</#if>
</@layout.emailLayout>