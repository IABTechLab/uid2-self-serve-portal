<#macro emailLayout>
<html>
<body>
  <div style="padding: 70px; text-align: center; font-family: 'Inter', sans-serif">
    <div style="padding: 20px">
      <a href="http://localhost:3000/"
        ><img src="http://localhost:3000/uid2-logo.png" alt="UID2 logo" style="height: 30px"
      /></a>
    </div>
    <div style="margin-top: 70px; width:500px; display: inline-block;">
      <#nested>
    </div>
  </div>
</body>
</html>
</#macro>