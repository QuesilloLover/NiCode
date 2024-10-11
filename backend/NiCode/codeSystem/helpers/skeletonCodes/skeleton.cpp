#include <iostream>
#include <vector>
#include <string>   
#include <cmath> 
#include <algorithm>   
using namespace std;

// Generic function to print any type
template <typename T>
std::string printResult(T result) 
{
    std::stringstream ss;
    ss << result;
    return ss.str();
}

// Specialization for std::vector
template <typename T>
std::string printResult(std::vector<T> result)
{
    std::stringstream ss;
    for (const auto& element : result) 
    {
        ss << element << " ";
    }
    return ss.str();
}
    

//USER_FUNCTION_GOES_HERE

int main() 
{
    string testResults = "";
    //TESTCASES_GOES_HERE


}