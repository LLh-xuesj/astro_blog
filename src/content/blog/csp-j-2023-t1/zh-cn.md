---
title: CSP-J-2023 T1-小苹果题解
pubDate: 2024-07-29
description: CSP-J 2023 第一题小苹果：开 1e9 的数组暴力模拟会 MLE 也会 TLE，改看每轮取走的苹果数如何递推，O(log n) 出解
category: 题解
tags:
  - 找规律
image: "./cover.webp"
draft: false
slugId: alg/csp-j-2023-t1
---

:::note
此题为CSP-J 2023 第一题小苹果。[题目传送门](https://www.luogu.com.cn/problem/P9748)
:::

## 做法一

首先阅读题目，发现可以用一个大小为 $10^9$ 的数组进行暴力模拟操作，可以先进行数量的枚举，然后在嵌套一层循环进行每天拿苹果的操作。但容易发现数据范围很大，数组开到1e9会 MLE 而也容易 TLE 拿不到满分。

## 做法二（正解）

首先我们发现，每次拿一个苹果后都需要隔两个苹果在拿下一个苹果。所以数据可以分为 $n>3$ 和 $1 \le n \le 3$ 两部分

### 第一部分

第一部分也就是 $n>3$ 的情况。我们列几个数字进行分析，如果 $n$ 为 $10$ 的情况下可以在第一天就取到编号为 $n$ 的苹果，易得当 $N$ $mod$ $3$ $= 1$ 的情况下便可在第一题的得到编号为n的苹果，所以可以在循环内进行判断，如果符合上述条件，那么就标记天数为当前天数。接着我们观察拿苹果后数量的编号，如果 $n$ 为 $10$ 那么第一天取完后便剩余$ 6 $ 个苹果，如果 $n$ 为 $9$ 那么第一天去完后也剩余 $6$ 个。所以易得取完一天后的苹果数量为  $N- \left \lceil \frac{N}{3}  \right \rceil $ ，通过循环依次向后推即可。

最终时间复杂度为 $ \Theta(log_{\frac{2}{3}}n) $

## 代码

```c++
#include<bits/stdc++.h>
using namespace std;
int n, aday, nday;
int main() {
	cin >> n;
	while (n > 3) {
		aday++;
		if (n % 3 == 1 && !nday) nday = aday;
		if (n % 3 == 0)	n -= n / 3;
		else	n -= n / 3 + 1;
	}
	aday += n;
	if (!nday) nday = aday;
	cout << aday << ' ' << nday << endl;
	return 0;
}
```
