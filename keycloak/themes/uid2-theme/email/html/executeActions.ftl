<#outputformat "plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#sep></#items></#list><#else></#if></#assign>
</#outputformat>

<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("inviteBodyHtml", user.firstName, link, linkExpirationFormatter(linkExpiration), "${properties.applicationURL}", user.email ))?no_esc}
</@layout.emailLayout>