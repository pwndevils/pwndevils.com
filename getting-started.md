---
layout: post
title: Getting Started
date: 2020-08-23 10:00:00
tags: tutorial
author: mahaloz
---

# A Warm Welcome
Welcome to your first few steps as a CTFer! In this post we attempt to give **all levels** of people a place to start for CTFing, whether that means you are a versed Linux nerd, or a very first user to the terminal. We love members of all skill and hope to help everyone in their journey to becoming a L33T haxor. Below you will find a series of statements that link to a section in this post. Start from the top of the statements and read down. The first statement that is true for you is the section you should start at.

As you go about these section, remember you can always reach out to anyone on the [Shellphish Discord](https://discord.gg/MeMcTvj) in the `#pwndevils` channel. We love to help new people learn!

# Starting Places
1. <A href="?#starting-as-a-bit">Bit</A>: I don't know what a VM or Linux is.
2. [Byte](#starting-as-a-byte): I'm not confident with **any** of the following commands: `find`, `ssh`, `file`, or `grep`.
3. [Kilobyte](#starting-as-a-kilobyte): I don't know C or how to use C pointers.
4. [Megabyte](#starting-as-a-megabyte): I don't know an assembly language. 
5. [Gigabyte](#starting-as-a-gigabyte): I don't know what a buffer overflow is.    

Say no to all the above statements? Then jump to [Where To Continue](#where-to-continue)

## Starting As A Bit ##
New to CTFs and computer security in general? No problem, the pwndevils got you covered (we were all curious newbies at one point)! Starting at this point will mean you have a lot to learn to be able to efficiently play CTF's, but that is ok!

The first thing you are going to want to do is learn about virtual machines (VM). There is a nice video that explains what a VM is [here](https://www.youtube.com/watch?v=yIVXjl4SwVo). Once you are comfortable with what a VM is, we should talk about how to get one. The most straight forward option to setting up a VM on your machine is with VirtualBox. VirtualBox is free and open-source. There is a nice installation video [here](https://www.youtube.com/watch?v=8mns5yqMfZk) or you can just check out the [VirtualBox Website](https://www.virtualbox.org/wiki/Downloads).

Once you have VirtualBox setup, you are going to want to setup Ubuntu 20.04 on your VirtualBox. You can find another video to install Ubuntu on your VB [here](https://www.youtube.com/watch?v=x5MhydijWmc). After all of this is done, you now have a Linux machine running on your current computer! Yay! You have taken your first steps to becoming a leet hacker. Next you are going to need to learn how to use Ubuntu/Linux. Before you continue onto the next section, mess around with Linux and learn how to use the terminal a little. It will be useful. Check out [this](https://www.youtube.com/watch?v=IVquJh3DXUA) video to learn some commands. 

Continue to the next "data" upgrade, [Byte](#starting-as-a-byte), to level up. 

## Starting as a Byte ##
Ah so you are a person of culture too. You know your ways around virtualization and you've probably messed around with Linux in the past. Well as a hacker you are going to need to level up your skill and get comfortable with **MOAR** virtualization and bash commands. Let's start with the latter.

### Learning to Bash ###
Learning to use the command line is crucial to being a good hacker. We, and CSE365 at ASU, recommends starting with [Overthewire: Bandit](https://overthewire.org/wargames/bandit/). Go on the Overthewire and complete Bandit challenges to learn more about being a leet linux hacker. At a minimum, you should complete levels **0 - 15**. You are free to complete all the challenges of Bandit if you want to be realllly leet, but you are not expected too.

### Moar Virtualization: Docker ###
Now that you know your way around the Linux terminal, we need to get just a little more virtualization into your Linux environment. In the modern development world [containers](https://www.youtube.com/watch?v=EnJ7qX9fkcU) have become quite important to making portable software. The most used containerization software is called [Docker](https://www.docker.com/). You can thing of containers as a miniature VM that is a little faster than a full scale VirtualBox VM. Yes we are running a VM in a VM. VM-Ception. We use Docker a lot on pwndevils so you are going to want to [install](https://docs.docker.com/engine/install/ubuntu/) and [learn](https://docs.docker.com/get-started/) how to use it.

After you have installed it, go ahead and pull our Docker Container that contains all our commonly used hacking tools: [pwndevils/pwnbox](https://github.com/pwndevils/pwnbox).

Now that you can virtualize and Linux like a pro, it's time to become a Kilobyte. Head to the next section.

## Starting as a Kilobyte ##
Starting as a Kilobyte means you already have some good Linux knowledge behind you, but you don't know `C` -- making it difficult to truly understand what is happening on the system level. When working with things on the system level (Firmware, Kernels, IOT Devices), [we need to use C](https://www.geeksforgeeks.org/benefits-c-language-programming-languages/) to keep the program nice and efficient. It also so happens that C is a language that is not a [Memory Safe language](https://en.wikipedia.org/wiki/Memory_safety), making it a gold mine for hackers. You must gain this hacker insight.

To gain this insight, you must learn the C programming language at a basic level. There are a lot of `C` guides out there. Here is [one](https://www.tutorialspoint.com/cprogramming/c_quick_guide.htm). We think you will be able to find more. We must emphasize that you need to learn **C** not **C++**. Since `C` is more low level, it will have much less high-level constructs than `C++`. Learn `C`. At a minimum know how to:
* use loops
* use functions
* use if-statements
* use structs
* use unions
* use pointers

The last bullet-point is really important. Knowing how to use pointers in `C` is crucial to the topics that are covered in the next sections. Here is a [tutorial](https://www.tutorialspoint.com/cprogramming/c_pointers.htm). Go through all the sections and make sure you understand how addresses, references, copys, and pointers work. Spend a few hours/days on these concepts. 


Now that you can has C, it's time to has assembly. Move to the next section young Megabyte. 

## Starting as a Megabyte ##
Starting as a Megabyte is a really good place to be as far as becoming a hacker is concerned. You have the ability to use `C` and the ability to mess around in Linux. It's time we take your hacking to the-next-level *TM*. From here on, you are going to be learning how to understand programs at the fundamental level, so things will get a lot harder. 

## Starting as a Gigabyte ##
TODO

# Where to continue? #
At this point, you have come really far as a intro hacker. You now have the ability to understand programs at the fundamental level and mess around with how they work. You can do a lot at this moment, but there is so much more to learn to becoming a god-like hacker. 

Some pwndevils, and professors, joined together and created a education platform called [pwn.college](https://pwn.college/). This site, and it's accompanying lectures, can teach you all the basic exploitation methods in binary exploitation. 
TODO
