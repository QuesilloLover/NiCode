def testAnalyzer(string):
    lines = string.split('\n')

    testResults = []
    isCorrect = True
    totalTestcases = 0
    badTestcase = -1
    for line in lines:
        i += 1
        elements = line.split('|')
        # Just change to check for [-1] and [-2] elements
        testResult = {}
        if elements[-1] == elements[-2]:
            testResult['result'] = 'Correct'
        else:
            testResult['result'] = 'Incorrect'
            isCorrect = False
            badTestcase = i
            break

        testResult.append(line)

    return {
        'isCorrect': isCorrect,
        'totalTestcases': totalTestcases,
        'badTestcase': badTestcase if badTestcase != -1 else None, 
        'testResults': testResults 
    }