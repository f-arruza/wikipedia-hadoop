# wikipedia-hadoop
hadoop jar WikiGraphInfo-0.0.1.jar uniandes.wikipedia.job.GraphJob /datos/enwiki-20170820-pages-articles-multistream.xml.bz2 /user/bigdata01/fernandofs/output 150001 201701

hadoop -jar <<Jar-file | WikiGraphInfo-0.0.1.jar>> <<Job-class | uniandes.wikipedia.job.GraphJob>> <<Input-folder | /datos/enwiki-20170820-pages-articles-multistream.xml.bz2>> <<Output-folder | /user/bigdata01/fernandofs/output>> <<Start-date(yyyyMM) | 150001>> <<End-date(yyyyMM) | 201701>>
