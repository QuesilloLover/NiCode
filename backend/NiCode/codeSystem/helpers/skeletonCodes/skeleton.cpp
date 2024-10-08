#include <iostream>
#include <vector>
#include <string>   
#include <cmath> 
#include <algorithm>   

// Generic function to print any type
template <typename T>
void printResult(T result) 
{
    std::cout << result << std::endl;
}

// Specialization for std::vector
template <typename T>
void printResult(std::vector<T> result)
{
    for (const auto& element : result) 
    {
        std::cout << element << " ";
    }
    std::cout << std::endl;
}

//USER_FUNCTION_GOES_HERE

int main() 
{
    //Testcases
}