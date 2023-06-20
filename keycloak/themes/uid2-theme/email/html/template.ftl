<#macro emailLayout>
<html>
<body>
  <div style="padding: 70px; text-align: center; font-family: 'Inter', sans-serif">
    <div style="padding: 20px">
      <a href="${url.loginUrl}"
        ><img src="https://portal.integ.unifiedid.com/uid2-logo.png" alt="UID2 logo" style="height: 30px"
      /></a>
    </div>
    <div style="margin-top: 70px; width:500px; display: inline-block;">
      <#nested>
    </div>
  </div>
</body>
</html>
</#macro>