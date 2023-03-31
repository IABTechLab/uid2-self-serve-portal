<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("passwordResetBodyHtml",user.firstName, link, linkExpirationFormatter(linkExpiration)))?no_esc}
</@layout.emailLayout>