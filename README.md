# S4STests
S4STests

Documentation:  https://docs.google.com/document/d/1CINwHNcJrFcc_xEsUAURPudOL3ROGNqPxyfVyhp_ZDQ/edit

NOTES:
expect true:  1
false 0

0000

test 1 : res |= 1 << (test# - 1)  == res |= 1 << 0 == res|= 1  pass == 0001
test 2 : res |= 1 << (test# - 1)  == res |= 1 << 1 == res |= 2 pass == 0011
test 3 : res |= 1 << (3 - 1) == res |= 1 << 2 == res |= 4 pass == 0111
res |= 1
res |= 4
res = res | 1 | 4 = pass == 0101

4 | 4 = 4
.
....

rs & 1 == 0
res & 4 == 4
res & 11 = 7 if it was a pass res & 11 = 11
8 | 2 | 1 === tests 1 2 4

res |= data == undefined ? 1 << count :  0;
true 

res == (2^count)-1;

16 = 2^4     == 10000 binary
15 = 2^4 - 1 == 1111 binary
