# Minesweeper

An implementation of the game Minesweeper in the browser.

This implementation can run without a web server by simply loading the index.html file into your browser.

From Wikipedia:

    The objective is to clear the board without detonating any mines, with help from clues about the number of neighboring mines in each field.

You can view [a YouTube video where I describe the steps I took to write this code](https://youtu.be/qtP1MBdThpc).


## Branches

The numbered branches show the development / problem-solving process for building the application. Each subsequent numbered branch adds new features to the previous step.

The main branch has the final code.

The `claude_code` branch has a completely different implementation of Minesweeper, created by Claude Code.


### Hand-crafted vs. Claude Code

[I go over the AI-generated code and compare it to my hand-crafted version in another YouTube video](https://youtu.be/d74o9Pv_A20). Here is the summary:


| | Hand-Created      | Claude Code |
| ---------- | ----------- | ----------- |
| Time | 3 Hours | 1 Hour ✅ |
| Functionality | Works! ✅ | Works! ✅ |
| Design/UI | Functional | Pretty ✅ |
| Algorithm: calculating neighbors | Efficient, O(mines) ✅ | Less efficient, O(tiles) |
| Algorithm: rendering tile changes | Efficient, O(1) ✅ | Inefficient, O(tiles) |
| Algorithm: updating mine count | Efficient, O(1) ✅ | Inefficient, O(tiles) |


