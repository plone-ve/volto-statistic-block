import React from 'react';
import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';
import cx from 'classnames';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { Statistic } from 'semantic-ui-react';
import { UniversalLink } from '@plone/volto/components';
import {
  serializeNodes as _serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';
import {
  serializeToNodes,
  serializeNodes,
} from '@eeacms/volto-statistic-block/helpers';

import './styles.less';

const CountUpWrapper = ({ countUpRef, start }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <VisibilitySensor
      onChange={(isVisible) => {
        start();
        if (isVisible && !visible) {
          setVisible(true);
        }
      }}
      active={!visible}
      delayedCall
    >
      <span ref={countUpRef} />
    </VisibilitySensor>
  );
};

const View = ({ data, mode }) => {
  const {
    horizontal = false,
    inverted = false,
    size = 'small',
    widths = 'one',
    items = [],
    styles = {},
    animation = {},
  } = data;
  const {
    backgroundInverted = 'primary',
    valueVariation = 'secondary',
    labelVariation = 'tertiary',
    extraVariation = 'tertiary',
  } = styles;

  if (!items.length && mode === 'edit') return <p>Add statistic items</p>;
  return (
    <div
      className={cx({
        [`color-bg-${backgroundInverted}`]: inverted,
      })}
    >
      <Statistic.Group
        horizontal={horizontal}
        inverted={inverted}
        size={size}
        widths={widths}
        backgroundvariant={backgroundInverted}
        valuevariation={valueVariation}
        labelvariation={labelVariation}
        extravariation={extraVariation}
        className={styles.align === 'full' ? 'ui container' : ''}
      >
        {items.map((item, index) => {
          const StatisticWrapper = item.href ? UniversalLink : Statistic;
          const slateNodes = serializeToNodes(item.value);
          const valueNo = Number(serializeNodesToText(slateNodes));

          return (
            <StatisticWrapper
              key={`${index}-${item.label}`}
              {...(item.href
                ? { className: 'ui statistic', href: item.href }
                : {})}
            >
              <Statistic.Value className={cx('slate', valueVariation)}>
                {animation.enabled && isNumber(valueNo) && !isNaN(valueNo) ? (
                  <CountUp
                    end={valueNo}
                    duration={animation.duration > 0 ? animation.duration : 2}
                    decimals={animation.decimals > 0 ? animation.decimals : 0}
                    prefix={animation.prefix || ''}
                    suffix={animation.suffix || ''}
                  >
                    {(props) => <CountUpWrapper {...props} />}
                  </CountUp>
                ) : (
                  _serializeNodes(slateNodes)
                )}
              </Statistic.Value>
              <Statistic.Label className={cx('slate', labelVariation)}>
                {serializeNodes(item.label)}
              </Statistic.Label>
              <div className={cx('slate text-center', extraVariation)}>
                {serializeNodes(item.info)}
              </div>
            </StatisticWrapper>
          );
        })}
      </Statistic.Group>
    </div>
  );
};

export default View;
