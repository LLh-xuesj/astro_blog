---
title: CSP-J-2023 T3-一元二次方程
pubDate: 2024-08-06
description: CSP-J 2023 第三题一元二次方程：按题目要求输出较大的实数根，有理数约分、无理数拆成 q1+q2√r 的模拟题
category: 题解
tags:
  - 模拟
image: "./cover.webp"
draft: false
slugId: alg/csp-j-2023-t3
---

:::note
此题为CSP-J 2023 第三题一元二次方程。[题目传送门](https://www.luogu.com.cn/problem/P9750)
:::

## 题面解释

这道题是让求一个一元二次方程的较大实数根，并按照题目指定的方法进行输出。

### 一元二次方程

首先需要先了解一下[一元二次方程](https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E4%BA%8C%E6%AC%A1%E6%96%B9%E7%A8%8B/7231190),题目中采用公式法来解方程。一元二次方程的一般形式为 $ax^2 + bx + c = 0$ ，系数为 $a$ , $b$ , $c$ 代入至 $\Delta = b^2 - 4ac$ 判断根的情况，如果有实数根则代入至 $x = \frac{-b\pm\sqrt{\Delta}}{2a} $ 求出根。

### 题目有理数输出格式

一个有理数 $v = \frac{p}{q}$ 将其约分至最简，如果可以整除输出`p`,否则输出`p/q`

### 解方程

解方程需要分为几步。首先判断根的情况，再判断根是有理数还是无理数，最后进行输出。

#### 方程无实数根

即 $\Delta < 0$ 无实数根，输出`NO`

#### 方程有两个相等的实数根

即 $\Delta = 0$ 方程的根为 $x=\frac{-b}{2a}$ 进行约分，根据有理数输出格式输出即可

#### 方程有两个不等的实数根

即 $\Delta > 0$ 方程的根为 $x = \frac{-b\pm\sqrt{\Delta}}{2a}$  , 由于 a 的正负不确定所以无法确定较大根是哪一种式子，所以需要在一开始就判断 a 的正负，如果 a 为负数，那么就将系数全部取反（这样不影响结果）。这样 $x = \frac{-b+\sqrt{\Delta}}{2a}$ 便是较大根。接下来判断 $\sqrt{\Delta}$ 是否为有理数，有理数则约分输出；无理数则需要将式子转化为 $x = q1+q2\sqrt{r}$ ，首先可以知道 $q1=\frac{-b}{2a}$ ,然后将 $\Delta$ 分解为 $x^2\times r$的结构，然后开出 $x$ ，所以 $q2=\frac{x}{2a}$ 。

## 代码

```c++
#include<bits/stdc++.h>
using namespace std;
int T,M,a,b,c,t,fz,fm,st,x,r;
void YueFen() // 约分函数
{
  int flag=0;
  if(fz<0) flag=1,fz=-fz;//如果分子是负数进行取反，避免约分后符号位出错
  int temp=__gcd(fz,fm);//求最大公约数
  fz/=temp,fm/=temp;
  if(flag) fz=-fz;//还原符号位
}
void x2r() // 用于将 delta 分解为x^2*r
{
  for(int i=sqrt(t);i>=1;i--)// x最大从 根号delta开始 从大往小枚举，确保第一个r是最简的
  {
    int temp=t/(i*i);
    if(temp*(i*i)==t){
      x=i,r=temp;
      return;
    }
  }
}
int main()
{
  cin>>T>>M;
  while(T--)
  {
    cin>>a>>b>>c;
    if(a<0) a=-a,b=-b,c=-c;//如果a为负数，全部取反，确保式子结果不变
    t=b*b-4*a*c;
    if(t<0)//delta < 0 无解
    {
      cout<<"NO"<<endl;
    }
    else if(t==0)//delta = 0 两个相等的实数根 x=-b/2a
    {
      fz=-b,fm=2*a;
      YueFen();
      if(fm==1) cout<<fz<<endl;
      else cout<<fz<<'/'<<fm<<endl;
    }
    else//delta > 0 方程两个不相等的实数根，计算较大的
    {
      st=sqrt(t);
      if(st*st==t)//判断 根号delta是否是有理数
      {
        fz=-b+st,fm=2*a;
        YueFen();
        if(fm==1) cout<<fz<<endl;
        else cout<<fz<<'/'<<fm<<endl;
      }
      else
      {
        if(b!=0)//计算q1
        {
          fz=-b,fm=2*a;
          YueFen();
          if(fm==1) cout<<fz<<'+';
          else cout<<fz<<'/'<<fm<<'+';
        }
        x2r();//用于将 delta 分解为x^2*r，开出x于2a进行约分的出q2，同时求出r
        fz=x,fm=2*a;
        YueFen();
        if(fz==fm)//输出
          cout<<"sqrt("<<r<<')'<<endl;
        else if(fm==1)
          cout<<fz<<"*sqrt("<<r<<')'<<endl;
        else if(fz==1)
          cout<<"sqrt("<<r<<")/"<<fm<<endl;
        else
          cout<<fz<<"*sqrt("<<r<<")/"<<fm<<endl;
      }
    }
  }
  return 0;
}
```
