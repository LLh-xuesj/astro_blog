---
title: 洛谷P9741 翻转与反转 题解
pubDate: 2023-10-27
description: 洛谷 P9741 翻转与反转：n 到 2×10⁶ 暴力必超时，从下标奇偶性推出 O(n) 的落点规律
category: 题解
tags:
  - 数学
  - 找规律
image: "./cover.webp"
draft: false
slugId: alg/luogu-p9741
railTitle: 翻转与反转
---

## 题目传送门

[洛谷P9741 翻转与反转](https://www.luogu.com.cn/problem/P9741)

## 题目分析

数据范围是$1\le n \le 2\times 10^6$ ，首先想到的是将如题的两个操作——翻转和反转模拟求解，但是会超时，于是有了第二种方法，规律通过每个数下标位置的变化和反转变化可得。

## 算法一

### 分析

看了数据范围就是到，$O(n^2)$的算法肯定会超时，奈何本人太菜，先写一个吧。首先用序列 $[1,1,1]$（样例1） 举个例子

| 操作次数 | 序列$a$的变化                                              |
| -------- | ---------------------------------------------------------- |
| 1        | $[1,1,1]→{\color{red} [1,1,1]} →{\color{purple} [0,1,1]} $ |
| 2        | $[0,1,1]→{\color{red} [1,0,1]} →{\color{purple} [0,1,1]} $ |
| 3        | $[0,1,1]→{\color{red} [1,1,0]} →{\color{purple} [0,0,1]} $ |

这是题目中所给的样例1的解释，上面的表格中，红色表示的是翻转后的结果，而紫色表示的是反转后的结果。在$i=1$的时候可以发现第$1$个数进行了翻转与反转，它的下标没有发生变化，在$i=2$时，第$1$个和第$2$个数进行了翻转，且第$2$个数反转为$1$第$1$个数反转为$0$，$i=3$时从第$3$个数翻转到第$1$个数，且第$3$个数原本为$1$，反转为$0$，第$2$个数字原本为$1$反转为$0$，第$1$个数原本为$0$反转为$1$，可以分析出规律：从第$i$个数到第$1$个数进行翻转，且翻转同时将原本的数进行取反。

### Code

```c++
#include <bits/stdc++.h>
#define ll long long int
using namespace std;
const int N((2 * (1e6)) + 1);
bool a[N], b[N];
int main()
{
    ll n;
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i], b[i] = a[i];
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= i; j++)
        {
            //从从第i个数到第1个数进行翻转，且翻转同时将原本的数进行取反。
            if (i % 2 != 0)
                a[j] = !(b[i - j + 1]);
            else
                b[j] = !(a[i - j + 1]);
        }
    }
    if (n % 2 == 0)
        for (int i = 1; i <= n; i++)
            cout << b[i] << ' ';
    else
        for (int i = 1; i <= n; i++)
            cout << a[i] << ' ';
    return 0;
}
```

[超时30pts](https://www.luogu.com.cn/record/129857292)

## 算法二

因为暴力枚举的算法是过不了的，所以我们需要找规律。首先找翻转的规律，其次找反转的规律。

### 翻转

首先我们观察样例一，一个长度为$3$的序列，这个序列的下标也就是 $[1,2,3]$ 它在翻转时的变化如下：

${\large [1,2,3]\to {\color{blue} [1,2,3]}\to {\color{green} [2,1,3]}\to {\color{orange}[3,1,2]}  } $

初步发现当$n$为奇数时，下标为奇数的跑到了前面，偶数的跑到了后面，自行举几个例子也是如此。

接着观察样例二，因为样例2有点长，我们用$n$也为偶数的序列研究。当序列长度为$n$时，序列下标为 $[1,2,3,4]$ 它在翻转时的变化如下：

${\large [1,2,3,4]\to {\color{blue}[1,2,3,4]}\to{\color{green}[2,1,3,4]}\to{\color{orange}[3,1,2,4]}\to{\color{red}[4,2,1,3]}} $

发现当$n$为偶数时，下标为偶数的跑的了前面，奇数的跑的了后面，自行举几个例子也是如此。

整理发现，当$n$为偶数时，如果$i$为偶数时会在前$n/2$项，并且$i$越大越靠前。当$i$为奇数时会在后$n/2$项，且$i$越大越靠后

当$n$为奇数时，如果$i$为偶数时会在后$n/2$项，并且$i$越大越靠后。当$i$为奇数时会出现在前$n/2+1$项，且$i$越大越靠前。

也就是说第$i$个数最后的落脚点与$n$和$i$的奇偶性，长度都有关系。

整理可得：

```c++
if (n % 2 == 0)
{
        for (int i = 1; i <= n; i++)
        {
            if (i % 2 == 0)
                b[(n / 2) - (i / 2) + 1] = a[i];
            else
                b[(n / 2) + (i / 2) + 1] = a[i];
        }
 }
 else
 {
       for (int i = 1; i <= n; i++)
       {
        	if (i % 2 == 0)
                b[(n / 2) + (i / 2) + 1] = a[i];
            else
                b[(n / 2) - (i / 2) + 1] = a[i];
       }
 }
```

### 反转

反转我们可以发现：当$n$为偶数时，前$n/2$项需要取反，后面的不变；当$n$为奇数时，前$n/2+1$项需要取反，后面的不必。

可得代码：

```c++
for (int i = 1; i <= n; i++) 
{
 	if (n % 2 == 0)
    {
		if (i <= n / 2)
		cout << !b[i] << ' ';
	else
		cout << b[i] << ' ';
    }
    else
    {
		if (i <= n / 2 + 1)
			cout << !b[i] << ' ';
        else
        	cout << b[i] << ' ';
    }
 }
```

## 代码

```c++
#include <bits/stdc++.h>
#define ll long long int
using namespace std;
const int N((2 * (1e6)) + 1);
int a[N], b[N];

int main()
{
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    //进行翻转操作
    if (n % 2 == 0)
    {
        for (int i = 1; i <= n; i++)
        {
            if (i % 2 == 0)
                b[(n / 2) - (i / 2) + 1] = a[i];
            else
                b[(n / 2) + (i / 2) + 1] = a[i];
        }
    }
    else
    {
        for (int i = 1; i <= n; i++)
        {
            if (i % 2 == 0)
                b[(n / 2) + (i / 2) + 1] = a[i];
            else
                b[(n / 2) - (i / 2) + 1] = a[i];
        }
    }
    //进行反转操作
    for (int i = 1; i <= n; i++)
    {
        if (n % 2 == 0)
        {
            if (i <= n / 2)
                cout << !b[i] << ' ';
            else
                cout << b[i] << ' ';
        }
        else
        {
            if (i <= n / 2 + 1)
                cout << !b[i] << ' ';
            else
                cout << b[i] << ' ';
        }
    }
    return 0;//完结撒花
}
```

[AC记录](https://www.luogu.com.cn/record/130050046)
