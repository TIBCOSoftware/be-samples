FraudCriteria.interval <<- 120000
FraudCriteria.debitsPercent <<- 0.8
FraudDetection <- function(debitTime,debitAmount,averageMonthlyBalance)
{	
	debitTimeLength <- length(debitTime)
	debitAmountLength <- length(debitAmount)
	i<-2
	#Need to make 3 debits to trigger FraudDetection rule. Hence first condition is to see time length(Number of time history values) is greater than 2
	while(debitTimeLength>2)
	{
		while(i<debitTimeLength)
		{
			SumOfDebits <- 0
			k<-debitTimeLength-i
			for(z in debitTimeLength:k)
			{
				SumOfDebits <- SumOfDebits+debitAmount[[z]]
			}
			if((debitTime[[debitTimeLength]]!=0) && (debitTime[[debitTimeLength]]-debitTime[[debitTimeLength-i]]<=FraudCriteria.interval) && (SumOfDebits>(FraudCriteria.debitsPercent*averageMonthlyBalance)))
			{
				return(TRUE)
			}
			else
			{
				i <- i+1
			}
		}
			debitTimeLength <- debitTimeLength-1
			i<-2
	}
		return(FALSE)
}
