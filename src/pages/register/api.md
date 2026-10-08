# 注册接口

POST /auth/register，复用 api/modules/user.ts register。请求 username、password，email/phone 可选；成功返回业务响应，注册后回登录。当前无短信发送/验证码验证接口，手机号分支明确提示尚未接入，不假报验证码已发送。
