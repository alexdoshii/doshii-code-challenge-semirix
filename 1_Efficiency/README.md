# Challenge #1: Efficiency

This challenge is all about efficient memory usage in NodeJS.

## Problem

We have a plaintext dump of all the athletes at the 2016 Rio Olympic Games and would like to count all of the individual gold medals awarded to all athletes. The dataset is located in `data/athletes.txt`.

In the `athletes.js` file there is a function that processes this correctly, but it has some issues... Namely that the memory usage is pretty high. Increasing the memory heap usage by around 25%, on my machine anyway.

This is where you come in.

Your task is the rewrite the function in `athletes.js` to something much more memory efficient. The goal being under 5% increase in heap usage.

## The Dataset

Here's a small sample
```
532037425,A Lam Shin                              ,KOR,female,9/23/86 ,1.68,56 ,fencing          ,0,0,0
435962603,Aaron Brown                             ,CAN,male  ,5/27/92 ,1.98,79 ,athletics        ,0,0,1
```
With column #9 being the number of gold medals won by the given athlete.

## Testing Your Solution

There is a spec written in order to test the result is correct and the heap usage increase is below 5%.

Just run `yarn test`

## The Rules

Feel free to use any tool, library etc. at your disposal to find the solution. The only restrictions are that you cannot amend the dataset, and cannot amend the tests.
