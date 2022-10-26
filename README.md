<p align="center">
  <img width="300" height="200" src="https://i.imgur.com/FZfe3yz.png">
</p>

## Who should use this app? 哪些用户应该使用该程序?
>The user which has a children who cannot discipline themselves on playing computer. 有一个不懂得自律地使用电脑的孩子的用户

## How to use this app? 如何使用该程序?
>1.download the installer from [Release Page](https://github.com/Himly1/bsd/releases/tag/v1) to your main account. 将安装程序从[Release Page](https://github.com/Himly1/bsd/releases/tag/v1)下载到你的主账户<br/>
>2.Open the installer as Administrators. 以管理员身份打开该安装程序<br/>
>3.Open the `BSD` app from your desktop. 打开你桌面的`BSD`程序

## How this app works? 该程序如何工作?
>First this app let you choose the account names which should be limited.<br/>
Then add a task to task scheduler which apply to all user, the task will check every minutes if the current user and the time ranges match if so it will shuwdown computer Immediately.<br/>
The task cannot be disable by any subaccount but Administrators accounts.


>首先该程序会让你选择一个或多个需要限制的用户名(对于不太懂电脑的人可能不知道Windows系统可以创建多个用户)<br/>
            其次将创建一个task到任务调度中心, 该任务每分钟执行一次，检查当前登录的用户和所限制的时间区间是否匹配, 如果匹配则立即关机
   
### QA
#### What should I do if my child know how to bypass it ? 我该怎么做如果我的孩子知道如何破解该程序?
>Well, it is not posibble for ordinary children if they dont know main account password (they should not know it), because the program setup in Administrators account which mean it is hard(for me because I am lazy) to bypass it in her account. But in some case she did bypassed this app (Congratulations to her, she is on her way) then this app cant help with that its not a problem of this app but its your problem to tech her how to be self-discipline.

>Well, 如果你的孩子不知道你的主账户密码，那么对于一般的孩子而言是非常困难的。如果你的孩子真的破解了该程序，那么恭喜她 she is on her way. 那么如何解决这个问题呢？ 该软件所解决的只是在很有限的范围内限制她，让她自律。 如果她真的破解了该程序，那么这个问题就不是一个软件所能解决了的了，而是需要你去教会她如何自律，毕竟她已经能做到破解该程序，那么加上自律，前途不可限量。


#### What should I do If I need to support new language ? 我该如何做如果我要支持新的语言?
>Well, You just need to add a json file to the folder `src/international` for example 'ar.json' <br>
then import the `ar.json` to `language.js` file and then add a field on the variable `lngs`

>Well, 首先你需要在`src/international`目录下创建一个json文件, 比如说`ar.json`<br/>
然后将`ar.json` import 到 `language.js` 最后在`lngs`变量中添加一个对应的property就可以了

#### When there will be mac package ? 什么时候会提供mac的安装包？
>Well, First I dont have mac device which mean I cannot test my app on mac device<br/>
Second, for now there only Windwos and Linux packages are provided but only Windwos will work which mean you can explore the app on linux but it will not work on linux<br/>
At the end, Hope someone will submit a pull requets which support the mac device before I got a mac device

>Well, 首先我没有Mac设备, 这意味这我无法进行测试, 其次, 目前只提供了Windwos的安装包和Linux的安装包, 但是只有Windwos是能够真正工作的,Linux你可以安装然后探索该程序,但是并不会工作，鉴于一般的孩子用不到Linux, 所有不太可能会支持了, 只供探索. 
最后, 希望在我能够得到一台Mac设备前有人能够提交Pull-Request以支持Mac

#### What should I do If I need to support new OS ? 我该如何做如果我要支持新系统?
>Its simple, just write the python script or whatever and put it in to `pythonScripts` folder. For details please read the document [ReadMeIfYouNeedToSupportNewPlatform.md](https://github.com/Himly1/bsd/blob/main/pythonScripts/ReadMeIfYouNeedToSupportNewPlatform.md)

>这很简单, 把该系统相关的python代码或者其他什么玩意儿放到`pythonScripts`目录下就可以了, 具体的请阅读该文档[ReadMeIfYouNeedToSupportNewPlatform.md](https://github.com/Himly1/bsd/blob/main/pythonScripts/ReadMeIfYouNeedToSupportNewPlatform.md)
