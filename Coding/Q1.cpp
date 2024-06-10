#include <iostream>
using namespace std;

int friends(int max_chocolates)
    {
        int a=0;                //First Fibbonaci number
        int b=1;                //Second Fibbonaci number
        int chocolates=0;
        int no_of_friends=0;
        while(chocolates+a<=max_chocolates)
        {
            chocolates+=a;
            no_of_friends+=1;
            int next=a+b;       //Third Fibbonaci number
            a=b;
            b=next;
        }
        return no_of_friends;
    }

int main()
{
    int max_chocolates;
    cin >> max_chocolates;
    cout << friends(max_chocolates);
    return 0;
}
