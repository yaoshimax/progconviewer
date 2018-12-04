import {Config} from './config.js';
var Codeforces = require('codeforces-api');

Codeforces.setApis(Config.codeforces_api_key, Config.codeforces_api_secret);

export default function getCfProblems(callback){
   Codeforces.contest.list({gym: false}, function(err, contests){
      if(err){
         console.log("error to get contest list"+ err);
         return;
      }
      console.log("got contest map");

      var contest_id_map = [];
      for( var i=0; i <contests.length; i++){
         contest_id_map[contests[i].id]=i;
      }
      console.log("created contest_id_map");

      Codeforces.problemset.problems({}, function(err, problemset){
         if(err){
            console.log("error to get problems"+ err);
            return;
         }
         console.log("got problemset");
         var problems = problemset.problems;
         //console.log(problemset);

         problems.map(function(problem){
            problem.link = "https://codeforces.com/contest/"+problem.contestId+"/problem/"+problem.index;
            problem.correct_count=0;
            problem.submit_count=0;
            problem.contestName = contests[contest_id_map[problem.contestId]].name;
            return problem;
         });

         Codeforces.user.status({handle:Config.codeforces_target_handlename}, function(err, submissions){
            if(err){
               console.log("error to get status"+err);
            }
            submissions.forEach(function(submission){
               //console.log(submission);
               var problem = problems.find(pb => pb.contestId === submission.contestId && pb.index === submission.problem.index);
               if(problem !== undefined ){
                  //console.log(problem);
                  if(submission.verdict === 'OK'){
                     problem.correct_count++;
                  }
                  problem.submit_count++;
               }
            });

            callback(problems);
         });
      });
   });
}
