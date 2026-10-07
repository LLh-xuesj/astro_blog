---
title: CSP-J-2023 T2-公路题解
pubDate: 2024-07-30
description: CSP-J 2023 第二题公路：贪心选下一个更便宜的加油站，前缀和求距离，油只能整升加所以要把余油一起算进去
category: 题解
tags:
  - 贪心
image: "./cover.webp"
draft: false
slugId: alg/csp-j-2023-t2
---

:::note
此题为CSP-J 2023 第二题公路。[题目传送门](https://www.luogu.com.cn/problem/P9749)
:::

## 分析

阅读题目后，考虑做法易得贪心。路上一共有 $N$ 个加油站，选择加油站应当选择下一个比当前便宜的加油站，如果没有比当前便宜的了那就下一站选择终点。我们需要在每个加油站加油使得恰好能够跑到下一个目标站点以取得最便宜的价钱，所以我们需要计算出下一个目标站点到当前站点的距离，于是采用前缀和的方式记录 $N$ 个加油站中第     $1$ ~ $i$ 的距离 $dis_i$ ，那么便可以求出任意两个加油站的距离。我们还需要一个数组用来求第 $i$ 个加油站后下一个要去的站点 $j$ 为多少，可以这样表示 `next_min[i] = j`。最后计算邮费的时候需要注意一个小坑，题目中提到了油只能加整升的油，也就是我们跑到目标站点的时候会有剩余的油，所以我们在加油的时候需要把剩余的部分一起考虑进去即可。最后注意要用long long不让50分。

## 代码

```c++
#include<bits/stdc++.h>
#define ll long long
using namespace std;
const int N = 1e5+5;
ll n,d,v[N],a[N],next_min[N],next_xb,next_jq,oil,sy_dis,ans;
//这些注释中n,d,v[],a[]是题目所要求的，next_min[],next_xb,next_jq是用来求下一个最便宜加油站的，oil,sy_dis,ans是用来求油价的
int main()
{
  cin>>n>>d;
  for(int i=2;i<=n;i++) cin>>v[i];//v只需要输入n-1从，至于从i = 2开始输入是为了下方求前缀和
  for(int i=1;i<=n;i++) cin>>a[i];
  for(int i=2;i<=n;i++) v[i]+=v[i-1];//求距离前缀和
  next_xb=1,next_jq=a[1];
  for(int i=2;i<=n;i++)
    if(a[i]<next_jq)//求取最便宜的加油站
      next_min[next_xb]=i,next_xb=i,next_jq=a[i];//记录下标和价格
  next_min[next_xb]=n;//如果后面没有在比当前便宜的加油站直接去终点
  int i=1;
  while(i<n)
  {
    oil=ceil((v[next_min[i]]-v[i]-sy_dis)*1.0/d);//计算到下一个站点需要多少油
    ans+=oil*a[i];//求油价
    sy_dis+=oil*d-(v[next_min[i]]-v[i]);//计算多余的油可以走多少路程
    i=next_min[i];//去下一个站点
  }
  cout<<ans<<endl;
  return 0;
}
```

蒟蒻在考场把程序写成了  $\Theta(n^2)$ ，痛失45分QWQ
