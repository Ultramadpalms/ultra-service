<?php
namespace UsaFactoryV2;
require_once __DIR__.'/Store.php';require_once __DIR__.'/Repository.php';require_once __DIR__.'/Shell.php';require_once __DIR__.'/ModelRenderer.php';require_once __DIR__.'/ServiceRenderer.php';
final class Adapter {
 static function trackingQuery(array $q):bool {foreach($q as $key=>$v)if(!in_array($key,['utm_source','utm_medium','utm_campaign','utm_term','utm_content','yclid','gclid','_openstat'],true)||!is_string($v)||strlen($v)>1024)return false;return true;}
 static function render():?string {
  $app=\Joomla\CMS\Factory::getApplication();$in=$app->getInput();if($in->getCmd('option')!=='com_content'||!in_array($in->getCmd('view'),['article','category'],true)||!in_array($_SERVER['REQUEST_METHOD']??'', ['GET','HEAD'],true)||!self::trackingQuery($_GET))return null;
  $dir=dirname(JPATH_ROOT).'/usa-factory';if(!is_file($dir.'/config.php'))return null;
  try{$cfg=require $dir.'/config.php';$host=strtolower(explode(':',$_SERVER['HTTP_HOST']??'')[0]);$mode=$cfg['mode']??'disabled';
   if(empty($cfg['enabled'])||!in_array($mode,['local','audit','production'],true))return null;
   if($mode==='production'&&(!in_array($host,['ultraserviceauto.ru','www.ultraserviceauto.ru'],true)||PHP_SAPI==='cli-server'))return null;
   if($mode==='local'&&!in_array($host,['127.0.0.1','localhost'],true))return null;
   if($mode==='audit'&&!in_array($host,$cfg['audit_hosts']??[],true))return null;
   $store=new Store($dir);$key=$in->getCmd('view').':'.$in->getInt('id');$found=$store->find($key);if(!$found)return null;$row=$found['row'];$r=$row['identity'];
   if(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH)!==parse_url($r['url'],PHP_URL_PATH))return null;
   $db=\Joomla\CMS\Factory::getContainer()->get(\Joomla\Database\DatabaseInterface::class);$start=$db->getCount();$repo=new Repository(static function($sql)use($db){$db->setQuery($sql);return $db->loadAssocList();});$s=$repo->snapshot($r);
   // Positive live prices flow through unchanged. Identity, OSMeta and source-content drift fail closed.
   $check=$s;$check['price']=$row['snapshot']['price'];if(Repository::fingerprint($check)!==$row['fingerprint'])throw new \RuntimeException('SOURCE_DRIFT');
   $v=$row['viewmodel'];$kind=$r['type'];
   if($kind==='service'){$decision=['decision'=>'YES','article_id'=>(int)$r['joomla_id'],'existing_url'=>$r['url'],'price'=>$s['price'],'service_code'=>$v['service_code']];$doc=\ServiceRenderer::render($v,$decision);preg_match('~<body[^>]*>(.*)</body>~s',$doc,$match);$body=preg_replace('~<div class="audit-note">.*?</div>~s','',$match[1]);}
   else{$v['groups']=$repo->prices($v['groups']);$body=ModelRenderer::render($v);}
   // Content is opt-in separately, never implied by a renderer switch.
   $body=Shell::seo($body,$key,$store->state());
   $context=['page_type'=>$kind,'brand'=>$v['brand']??null,'model'=>$v['model_name'],'service'=>$v['service_code']??null,'joomla_id'=>(int)$r['joomla_id']];
   if($mode!=='production'){header('X-Robots-Tag: noindex, nofollow');header('X-USA-Factory-Wave: '.$found['wave']);header('X-USA-Factory-Queries: '.($db->getCount()-$start));}
   return Shell::wrap($body,$v,$kind,$mode,$context);
  }catch(\Throwable $e){error_log('USA_FACTORY_V2: '.(preg_match('/^[A-Z_]+$/',$e->getMessage())?$e->getMessage():'RENDER_FAILURE'));return null;}
 }
}
